import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Timer, 
  Code2, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "To-Do", href: "/todo", icon: CheckSquare },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "LeetCode", href: "/leetcode", icon: Code2 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={cn(
      "relative bg-gradient-card border-r border-border transition-all duration-300 ease-in-out backdrop-blur-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 bg-background border border-border rounded-full w-6 h-6 p-0 shadow-soft hover:shadow-glow transition-all duration-200"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                ProductiveFlow
              </h1>
              <p className="text-xs text-muted-foreground">Your productivity hub</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group transform hover:scale-105",
                isActive
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="truncate">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Stats (when expanded) */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="bg-gradient-secondary p-4 rounded-lg border border-border backdrop-blur-sm">
            <h3 className="font-medium text-sm mb-2">Quick Stats</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tasks Done</span>
                <span className="text-success font-medium">-/-</span>
              </div>
              <div className="flex justify-between">
                <span>Study Time</span>
                <span className="text-primary font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode</span>
                <span className="text-accent font-medium">-%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex-1 justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="absolute bottom-4 left-2 right-2 space-y-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full p-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}