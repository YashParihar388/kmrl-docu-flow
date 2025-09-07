import { Search, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">KMRL</h1>
                <p className="text-sm text-muted-foreground">Document Management System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-10 bg-muted/50 border-border focus:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">KMRL Admin</p>
              </div>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};