import { useState } from "react";
import { ArrowRight, Users, Mail, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Department {
  id: string;
  name: string;
  head: string;
  avatar: string;
  color: string;
  documentTypes: string[];
  activeDocuments: number;
  pendingNotifications: number;
}

interface RoutingRule {
  id: string;
  condition: string;
  action: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
}

export const SmartRouting = () => {
  const departments: Department[] = [
    {
      id: 'finance',
      name: 'Finance',
      head: 'Rajesh Kumar',
      avatar: '/api/placeholder/32/32',
      color: 'bg-secondary text-secondary-foreground',
      documentTypes: ['Invoice', 'Purchase Order', 'Budget Report'],
      activeDocuments: 12,
      pendingNotifications: 3
    },
    {
      id: 'engineering',
      name: 'Engineering',
      head: 'Priya Nair',
      avatar: '/api/placeholder/32/32',
      color: 'bg-warning text-warning-foreground',
      documentTypes: ['Maintenance Report', 'Technical Specification', 'Inspection Report'],
      activeDocuments: 8,
      pendingNotifications: 2
    },
    {
      id: 'safety',
      name: 'Safety & Operations',
      head: 'Suresh Menon',
      avatar: '/api/placeholder/32/32',
      color: 'bg-destructive text-destructive-foreground',
      documentTypes: ['Safety Report', 'Incident Report', 'Training Certificate'],
      activeDocuments: 5,
      pendingNotifications: 1
    },
    {
      id: 'admin',
      name: 'Administration',
      head: 'Lakshmi Pillai',
      avatar: '/api/placeholder/32/32',
      color: 'bg-primary text-primary-foreground',
      documentTypes: ['HR Document', 'Policy Document', 'General Correspondence'],
      activeDocuments: 15,
      pendingNotifications: 4
    }
  ];

  const routingRules: RoutingRule[] = [
    {
      id: '1',
      condition: 'Document Type = Invoice AND Amount > ₹1,00,000',
      action: 'Route to Finance Department Head',
      department: 'Finance',
      priority: 'high'
    },
    {
      id: '2',
      condition: 'Keywords contain "safety incident" OR "emergency"',
      action: 'Immediate notification to Safety Team',
      department: 'Safety & Operations',
      priority: 'high'
    },
    {
      id: '3',
      condition: 'Document Type = Maintenance Report',
      action: 'Route to Engineering Department',
      department: 'Engineering',
      priority: 'medium'
    },
    {
      id: '4',
      condition: 'Sender Domain = contractor.com',
      action: 'Route to Administration for approval',
      department: 'Administration',
      priority: 'medium'
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Smart Routing & Notifications</h2>
        <p className="text-muted-foreground">
          Intelligent document routing based on content analysis and business rules
        </p>
      </div>

      {/* Department Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={dept.color}>
                  {dept.name}
                </Badge>
                <div className="relative">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  {dept.pendingNotifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
                      {dept.pendingNotifications}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={dept.avatar} alt={dept.head} />
                  <AvatarFallback>{dept.head.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{dept.head}</p>
                  <p className="text-xs text-muted-foreground">Department Head</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Docs:</span>
                  <span className="font-medium">{dept.activeDocuments}</span>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground mb-1">Handles:</p>
                  <div className="flex flex-wrap gap-1">
                    {dept.documentTypes.slice(0, 2).map((type, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {dept.documentTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{dept.documentTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Active Routing Rules</span>
          </CardTitle>
          <CardDescription>
            Automated rules that determine document routing and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routingRules.map((rule) => (
              <div key={rule.id} className="p-4 bg-gradient-card rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(rule.priority)}>
                      {rule.priority}
                    </Badge>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit Rule
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-sm font-medium mb-1">Condition</p>
                    <p className="text-sm text-muted-foreground">{rule.condition}</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Action</p>
                    <p className="text-sm text-muted-foreground">{rule.action}</p>
                    <Badge variant="outline" className="mt-1">
                      {rule.department}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button className="w-full" variant="outline">
              Create New Routing Rule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};