import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Timer, 
  Code2, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "To-Do", href: "/todo", icon: CheckSquare },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "LeetCode", href: "/leetcode", icon: Code2 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative bg-gradient-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 bg-background border border-border rounded-full w-6 h-6 p-0 shadow-soft hover:shadow-medium transition-all duration-200"
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
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                ProductiveFlow
              </h1>
              <p className="text-xs text-muted-foreground">@haryiank</p>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-primary text-white shadow-medium"
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
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-secondary p-4 rounded-lg border border-border">
            <h3 className="font-medium text-sm mb-2">Quick Stats</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tasks Done</span>
                <span className="text-success font-medium">12/15</span>
              </div>
              <div className="flex justify-between">
                <span>Study Time</span>
                <span className="text-primary font-medium">4h 32m</span>
              </div>
              <div className="flex justify-between">
                <span>LeetCode</span>
                <span className="text-accent font-medium">68%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}