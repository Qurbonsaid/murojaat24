import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Zap, Droplet, Wrench } from "lucide-react";

interface TaskCardProps {
  requestNumber: string;
  type: string;
  address: string;
  distance: string;
  time: string;
  status: "new" | "in-progress";
  urgent?: boolean;
  onClick: () => void;
}

const getTypeIcon = (type: string) => {
  if (type.includes("Elektr")) return <Zap className="h-4 w-4" />;
  if (type.includes("Suv")) return <Droplet className="h-4 w-4" />;
  return <Wrench className="h-4 w-4" />;
};

const TaskCard = ({ requestNumber, type, address, distance, time, status, urgent, onClick }: TaskCardProps) => {
  const statusColor = status === "new" ? "bg-blue-500" : "bg-yellow-500";
  const buttonText = status === "new" ? "Qabul qilish" : "Davom etish";

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className={`h-1 ${statusColor} rounded-t-lg`} />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-foreground">{requestNumber}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {getTypeIcon(type)}
                <span className="ml-1">{type}</span>
              </Badge>
              {urgent && (
                <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                  Jiddiy
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="text-primary font-medium">{distance}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <Button className="w-full" size="sm">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
