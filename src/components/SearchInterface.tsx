import { useState } from "react";
import { Search, Filter, Calendar, Tag, FileText, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface SearchResult {
  id: string;
  filename: string;
  type: string;
  department: string;
  uploadDate: string;
  size: string;
  keywords: string[];
  summary: string;
  relevanceScore: number;
}

export const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const searchResults: SearchResult[] = [
    {
      id: '1',
      filename: 'quarterly_safety_report_Q4_2023.pdf',
      type: 'Safety Report',
      department: 'Safety & Operations',
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      keywords: ['safety audit', 'quarterly review', 'incident analysis', 'platform safety'],
      summary: 'Comprehensive safety review for Q4 2023 covering platform safety measures, incident analysis, and recommended improvements for passenger safety.',
      relevanceScore: 95
    },
    {
      id: '2',
      filename: 'maintenance_schedule_jan_2024.xlsx',
      type: 'Maintenance Report',
      department: 'Engineering',
      uploadDate: '2024-01-20',
      size: '1.1 MB',
      keywords: ['preventive maintenance', 'track inspection', 'rolling stock', 'scheduled repairs'],
      summary: 'Detailed maintenance schedule for January 2024 including track inspections, rolling stock maintenance, and preventive care procedures.',
      relevanceScore: 88
    },
    {
      id: '3',
      filename: 'vendor_invoice_tech_services_dec2023.pdf',
      type: 'Invoice',
      department: 'Finance',
      uploadDate: '2024-01-10',
      size: '456 KB',
      keywords: ['IT services', 'software licensing', 'annual payment', 'technology upgrade'],
      summary: 'Invoice for annual IT services and software licensing fees for technology infrastructure upgrade completed in December 2023.',
      relevanceScore: 76
    },
    {
      id: '4',
      filename: 'emergency_response_protocol_update.docx',
      type: 'Safety Report',
      department: 'Safety & Operations',
      uploadDate: '2024-01-22',
      size: '890 KB',
      keywords: ['emergency procedures', 'protocol update', 'response time', 'training manual'],
      summary: 'Updated emergency response protocols including new procedures for medical emergencies and evacuation protocols with improved response times.',
      relevanceScore: 92
    }
  ];

  const documentTypes = ['Invoice', 'Safety Report', 'Maintenance Report', 'Contract', 'Policy Document'];
  const departments = ['Finance', 'Engineering', 'Safety & Operations', 'Administration'];

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

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-success text-success-foreground';
    if (score >= 70) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const filteredResults = searchResults.filter(result => {
    const matchesQuery = !searchQuery || 
      result.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      result.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || result.type === selectedType;
    const matchesDepartment = !selectedDepartment || result.department === selectedDepartment;
    
    return matchesQuery && matchesType && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Document Search & Discovery</h2>
        <p className="text-muted-foreground">
          Find documents quickly using AI-powered search across all content
        </p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by filename, keywords, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {filteredResults.length} documents
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-medium transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{result.filename}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(result.type)}>
                        {result.type}
                      </Badge>
                      <Badge variant="outline">
                        {result.department}
                      </Badge>
                      <Badge className={getRelevanceColor(result.relevanceScore)}>
                        {result.relevanceScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {result.summary}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upload Date:</span>
                    <span className="font-medium">{new Date(result.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="font-medium">{result.size}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};