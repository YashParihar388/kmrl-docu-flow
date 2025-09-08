import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  filename: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  summary?: string;
  author?: string;
  entity?: string;
  uploadDate?: string;
  error?: string;
}

export const FileUploadSystem: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'text/csv'
      ];
      
      const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} is not supported. Please upload PDF, DOCX, DOC, TXT, or CSV files.`,
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB. Please upload a smaller file.`,
          variant: "destructive"
        });
        return;
      }

      const fileId = Math.random().toString(36).substr(2, 9);
      const uploadedFile: UploadedFile = {
        id: fileId,
        filename: file.name,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, uploadedFile]);
      processFile(file, fileId);
    });
  };

  const processFile = async (file: File, fileId: string) => {
    try {
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processing', progress: 50 } : f
      ));

      const formData = new FormData();
      formData.append('file', file);

      const response = await supabase.functions.invoke('process-file-with-gemini', {
        body: formData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      // Update file with results
      setFiles(prev => prev.map(f => 
        f.id === fileId ? {
          ...f,
          status: 'completed',
          progress: 100,
          summary: result.analysis.summary,
          author: result.analysis.author,
          entity: result.analysis.entity,
          uploadDate: new Date().toLocaleDateString()
        } : f
      ));

      toast({
        title: "File processed successfully",
        description: `${file.name} has been analyzed and added to your history.`
      });

    } catch (error) {
      console.error('File processing error:', error);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? {
          ...f,
          status: 'error',
          progress: 100,
          error: error instanceof Error ? error.message : 'Processing failed'
        } : f
      ));

      toast({
        title: "Processing failed",
        description: `Failed to process ${file.name}. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload PDF, DOCX, DOC, TXT, or CSV files for AI-powered analysis with Gemini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF, DOCX, DOC, TXT, CSV (max 10MB)
            </p>
            <Input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.csv"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>
              Track the progress of your uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span className="font-medium">{file.filename}</span>
                    </div>
                    <Badge className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>
                  </div>
                  
                  <Progress value={file.progress} className="mb-3" />
                  
                  {file.status === 'completed' && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Summary:</strong> {file.summary}
                      </div>
                      <div className="flex gap-4">
                        <div><strong>Author:</strong> {file.author}</div>
                        <div><strong>Entity:</strong> {file.entity}</div>
                        <div><strong>Date:</strong> {file.uploadDate}</div>
                      </div>
                    </div>
                  )}
                  
                  {file.status === 'error' && file.error && (
                    <div className="text-red-600 text-sm">
                      <strong>Error:</strong> {file.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};