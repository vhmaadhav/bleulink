import { Bell, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DashboardHeaderProps {
  userRole?: "OPERATOR" | "SUPERVISOR" | "MANAGER";
  alertCount?: number;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

export default function DashboardHeader({
  userRole = "OPERATOR",
  alertCount = 0,
  onThemeToggle,
  isDark = false,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background h-16 flex items-center px-6">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">BL</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">BleuLink</h1>
            <p className="text-xs text-muted-foreground">Coolant Monitoring</p>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search machines..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className="text-xs font-medium tracking-wider"
          data-testid="badge-user-role"
        >
          {userRole}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
