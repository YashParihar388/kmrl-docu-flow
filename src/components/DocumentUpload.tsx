import { useState } from "react";
import { Upload, FileText, Mail, FolderOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface UploadChannel {
  id: string;
  name: string;
  icon: any;
  description: string;
  status: 'active' | 'processing' | 'complete';
}

export const DocumentUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const channels: UploadChannel[] = [
    {
      id: 'file-upload',
      name: 'File Upload',
      icon: Upload,
      description: 'Direct file upload from your device',
      status: 'active'
    },
    {
      id: 'email',
      name: 'Email Integration',
      icon: Mail,
      description: 'Automatic ingestion from email attachments',
      status: 'active'
    },
    {
      id: 'sharepoint',
      name: 'SharePoint Sync',
      icon: FolderOpen,
      description: 'Sync with SharePoint document library',
      status: 'active'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Document uploaded successfully",
        description: `${files[0].name} has been processed and classified`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Multi-Channel Document Ingestion</h2>
        <p className="text-muted-foreground">
          Upload documents through multiple channels for automatic processing
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.id} className="relative hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {channel.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {channel.description}
                </CardDescription>
                
                {channel.id === 'file-upload' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag & drop files here or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                          {uploading ? "Processing..." : "Choose Files"}
                        </Button>
                      </label>
                    </div>
                  </div>
                )}

                {channel.id === 'email' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Connected:</span>
                      <span className="font-medium">admin@kmrl.gov.in</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last sync:</span>
                      <span className="font-medium">2 minutes ago</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Rules
                    </Button>
                  </div>
                )}

                {channel.id === 'sharepoint' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Library:</span>
                      <span className="font-medium">KMRL Documents</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auto-sync:</span>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Folder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};