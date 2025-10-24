interface CircularGaugeProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
}

export default function CircularGauge({
  value,
  max = 100,
  label,
  unit = "%",
  size = "md",
}: CircularGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (percentage >= 50) return "text-chart-1";
    if (percentage >= 20) return "text-yellow-500";
    return "text-destructive";
  };

  const getStrokeColor = () => {
    if (percentage >= 50) return "stroke-chart-1";
    if (percentage >= 20) return "stroke-yellow-500";
    return "stroke-destructive";
  };

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-40 h-40",
    lg: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted/30"
          />
          <circle
            cx="50%"
            cy="50%"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getStrokeColor()} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSizes[size]} font-bold ${getStatusColor()}`} data-testid="text-gauge-value">
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground font-medium">{unit}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-center text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
