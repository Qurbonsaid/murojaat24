import { Clock, MapPin, Zap, Droplet, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewRequestCardProps {
  requestNumber: string;
  type: string;
  address: string;
  time: string;
  onAssign: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "elektr":
      return <Zap className="h-4 w-4" />;
    case "suv":
      return <Droplet className="h-4 w-4" />;
    default:
      return <Wrench className="h-4 w-4" />;
  }
};

const NewRequestCard = ({ requestNumber, type, address, time, onAssign }: NewRequestCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">{requestNumber}</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {getTypeIcon(type)}
                <span className="ml-1">{type}</span>
              </Badge>
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Yangi</Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>

        <Button size="sm" className="w-full" onClick={onAssign}>
          Yo'naltirish
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewRequestCard;
