import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentClassification } from "@/components/DocumentClassification";
import { SmartRouting } from "@/components/SmartRouting";
import { SearchInterface } from "@/components/SearchInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, Route, Search, TrendingUp, Clock } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const stats = [
    {
      title: "Documents Processed",
      value: "1,247",
      change: "+12%",
      icon: Upload,
      color: "text-primary"
    },
    {
      title: "Classification Accuracy",
      value: "94.2%",
      change: "+2.1%",
      icon: Brain,
      color: "text-success"
    },
    {
      title: "Avg Processing Time",
      value: "2.3s",
      change: "-0.4s",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Active Routes",
      value: "23",
      change: "+3",
      icon: Route,
      color: "text-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary-light px-4 py-2 rounded-full mb-4">
            <Badge variant="secondary">AI-Powered</Badge>
            <span className="text-sm font-medium text-primary">Document Management System</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            KMRL Intelligent Document Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline document processing with AI-powered classification, smart routing, and intelligent search capabilities
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-success flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 bg-primary-light rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Interface */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="text-2xl">Document Management Operations</CardTitle>
            <CardDescription>
              Manage your document lifecycle from ingestion to routing and search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger value="classification" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Classification</span>
                </TabsTrigger>
                <TabsTrigger value="routing" className="flex items-center space-x-2">
                  <Route className="h-4 w-4" />
                  <span>Routing</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="upload" className="space-y-6">
                  <DocumentUpload />
                </TabsContent>
                
                <TabsContent value="classification" className="space-y-6">
                  <DocumentClassification />
                </TabsContent>
                
                <TabsContent value="routing" className="space-y-6">
                  <SmartRouting />
                </TabsContent>
                
                <TabsContent value="search" className="space-y-6">
                  <SearchInterface />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
