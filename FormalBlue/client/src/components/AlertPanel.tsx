import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface Alert {
  id: string;
  machineId: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export default function AlertPanel({ alerts, onDismiss, onMarkAllRead }: AlertPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-chart-1";
    }
  };

  return (
    <Card className="w-full" data-testid="card-alert-panel">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">System Alerts</CardTitle>
          <Badge variant="secondary" className="h-6">
            {alerts.length}
          </Badge>
        </div>
        {alerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            data-testid="button-mark-all-read"
          >
            Mark All Read
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="relative border-l-4"
                  style={{
                    borderLeftColor: alert.type === "critical" ? "hsl(var(--destructive))" : 
                                     alert.type === "warning" ? "#eab308" : 
                                     "hsl(var(--chart-1))"
                  }}
                  data-testid={`alert-${alert.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={getAlertColor(alert.type)}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {alert.machineId}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDismiss?.(alert.id)}
                        data-testid={`button-dismiss-${alert.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
