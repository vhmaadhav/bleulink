import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

export interface ChartDataPoint {
  time: string;
  mixedCoolant: number;
  rawCoolant?: number;
  flowRate?: number;
}

interface UsageChartProps {
  title: string;
  data: ChartDataPoint[];
  showRaw?: boolean;
  showFlowRate?: boolean;
}

export default function UsageChart({ title, data, showRaw = true, showFlowRate = false }: UsageChartProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");

  return (
    <Card data-testid="card-usage-chart">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("24h")}
            data-testid="button-range-24h"
          >
            24h
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            data-testid="button-range-7d"
          >
            7d
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            data-testid="button-range-30d"
          >
            30d
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: "Level (%)", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mixedCoolant"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              name="Mixed Coolant"
            />
            {showRaw && (
              <Line
                type="monotone"
                dataKey="rawCoolant"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                name="Raw Coolant"
              />
            )}
            {showFlowRate && (
              <Line
                type="monotone"
                dataKey="flowRate"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
                name="Flow Rate"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
