import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Droplet, TrendingUp, Clock } from "lucide-react";
import CircularGauge from "./CircularGauge";

interface MachineCardProps {
  machineId: string;
  name?: string;
  status: "normal" | "warning" | "critical";
  mixedCoolantLevel: number;
  rawCoolantLevel: number;
  flowRate: number;
  mixRatio: number;
  timeToRefill?: string;
  onViewDetails?: () => void;
}

export default function MachineCard({
  machineId,
  name,
  status,
  mixedCoolantLevel,
  rawCoolantLevel,
  flowRate,
  mixRatio,
  timeToRefill,
  onViewDetails,
}: MachineCardProps) {
  const statusConfig = {
    normal: { label: "Normal", variant: "default" as const, color: "bg-chart-1" },
    warning: { label: "Warning", variant: "secondary" as const, color: "bg-yellow-500" },
    critical: { label: "Critical", variant: "destructive" as const, color: "bg-destructive" },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className="hover-elevate" data-testid={`card-machine-${machineId}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h3 className="text-lg font-semibold" data-testid={`text-machine-id-${machineId}`}>
            {machineId}
          </h3>
          {name && <p className="text-sm text-muted-foreground">{name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentStatus.color} animate-pulse`} />
          <Badge variant={currentStatus.variant} className="text-xs">
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <CircularGauge
            value={mixedCoolantLevel}
            label="Mixed Coolant"
            size="md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplet className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide font-medium">Raw Level</span>
            </div>
            <p className="text-2xl font-bold" data-testid={`text-raw-level-${machineId}`}>
              {rawCoolantLevel.toFixed(1)}%
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide font-medium">Flow Rate</span>
            </div>
            <p className="text-2xl font-bold" data-testid={`text-flow-rate-${machineId}`}>
              {flowRate.toFixed(1)}<span className="text-sm text-muted-foreground ml-1">L/h</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide font-medium">Mix Ratio</span>
            </div>
            <p className="text-2xl font-bold" data-testid={`text-mix-ratio-${machineId}`}>
              1:{mixRatio.toFixed(1)}
            </p>
          </div>

          {timeToRefill && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide font-medium">Refill In</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500" data-testid={`text-time-refill-${machineId}`}>
                {timeToRefill}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={onViewDetails}
          data-testid={`button-view-details-${machineId}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
