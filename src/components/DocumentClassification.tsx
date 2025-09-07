import { useState, useEffect } from "react";
import { FileText, Brain, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DocumentClassification {
  id: string;
  filename: string;
  type: 'Invoice' | 'Safety Report' | 'Maintenance Report' | 'Contract' | 'Unknown';
  confidence: number;
  extractedEntities: {
    dates: string[];
    organizations: string[];
    amounts: string[];
    keywords: string[];
  };
  status: 'processing' | 'classified' | 'routed';
  department: string;
  priority: 'high' | 'medium' | 'low';
}

export const DocumentClassification = () => {
  const [documents, setDocuments] = useState<DocumentClassification[]>([
    {
      id: '1',
      filename: 'maintenance_report_2024.pdf',
      type: 'Maintenance Report',
      confidence: 95,
      extractedEntities: {
        dates: ['2024-01-15', '2024-01-20'],
        organizations: ['KMRL', 'Metro Engineering Dept'],
        amounts: ['₹45,000'],
        keywords: ['track maintenance', 'inspection', 'safety check']
      },
      status: 'classified',
      department: 'Engineering',
      priority: 'high'
    },
    {
      id: '2',
      filename: 'invoice_dec_2023.pdf',
      type: 'Invoice',
      confidence: 89,
      extractedEntities: {
        dates: ['2023-12-30'],
        organizations: ['TechCorp Solutions', 'KMRL'],
        amounts: ['₹2,50,000', '₹45,000'],
        keywords: ['software licensing', 'annual payment', 'IT services']
      },
      status: 'routed',
      department: 'Finance',
      priority: 'medium'
    },
    {
      id: '3',
      filename: 'safety_incident_report.docx',
      type: 'Safety Report',
      confidence: 92,
      extractedEntities: {
        dates: ['2024-01-22'],
        organizations: ['KMRL Safety Team', 'Emergency Response'],
        amounts: [],
        keywords: ['incident report', 'passenger safety', 'platform slip', 'medical attention']
      },
      status: 'processing',
      department: 'Safety & Operations',
      priority: 'high'
    }
  ]);

  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'classified':
        return <Brain className="h-4 w-4 text-primary" />;
      case 'routed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Invoice':
        return 'bg-secondary text-secondary-foreground';
      case 'Safety Report':
        return 'bg-destructive-light text-destructive';
      case 'Maintenance Report':
        return 'bg-warning-light text-warning';
      case 'Contract':
        return 'bg-primary-light text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">AI-Powered Document Classification</h2>
        <p className="text-muted-foreground">
          Automatic document analysis and entity extraction using machine learning
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, index) => (
          <Card key={doc.id} className="animate-slide-up hover:shadow-medium transition-all duration-300" 
                style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.filename}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm capitalize text-muted-foreground">{doc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getPriorityColor(doc.priority)}>
                    {doc.priority} priority
                  </Badge>
                  <Badge className={getTypeColor(doc.type)}>
                    {doc.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {doc.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Classification Results</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{doc.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{doc.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{doc.department}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Extracted Entities</h4>
                  <div className="space-y-2">
                    {doc.extractedEntities.dates.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Dates: </span>
                        <span className="font-medium">{doc.extractedEntities.dates.join(', ')}</span>
                      </div>
                    )}
                    {doc.extractedEntities.amounts.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Amounts: </span>
                        <span className="font-medium">{doc.extractedEntities.amounts.join(', ')}</span>
                      </div>
                    )}
                    {doc.extractedEntities.keywords.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Keywords: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.extractedEntities.keywords.slice(0, 3).map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {doc.status !== 'processing' && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                    <span>Routed to {doc.department}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};