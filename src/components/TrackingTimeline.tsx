import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface TimelineStep {
  id: number;
  title: string;
  time: string;
  description: string;
  badge?: string;
  status: "completed" | "in-progress" | "pending";
}

interface TrackingTimelineProps {
  steps: TimelineStep[];
}

const TrackingTimeline = ({ steps }: TrackingTimelineProps) => {
  const getStatusIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-8 w-8 text-secondary" />;
      case "in-progress":
        return <Loader2 className="h-8 w-8 text-warning animate-spin" />;
      case "pending":
        return <Circle className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-secondary";
      case "in-progress":
        return "bg-warning";
      case "pending":
        return "bg-border";
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Murojaat holati</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="relative z-10 bg-card rounded-full p-1">
                    {getStatusIcon(step.status)}
                  </div>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-10 w-0.5 h-[calc(100%+1rem)] -translate-x-1/2 transition-all duration-500",
                        getStatusColor(step.status),
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    {step.badge && (
                      <Badge
                        variant={step.status === "in-progress" ? "default" : "secondary"}
                        className={cn(
                          step.status === "in-progress" &&
                            "bg-warning text-warning-foreground",
                        )}
                      >
                        {step.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.time}</p>
                  <p className="text-sm">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingTimeline;
