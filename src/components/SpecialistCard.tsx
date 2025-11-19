import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface SpecialistCardProps {
  name: string;
  position: string;
  status: "busy" | "available";
  currentTasks: string;
  location?: string;
}

const SpecialistCard = ({ name, position, status, currentTasks, location }: SpecialistCardProps) => {
  const initials = name.split(" ").map(n => n[0]).join("");
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{position}</p>
              </div>
              <Badge 
                className={status === "available" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-yellow-500 hover:bg-yellow-600"
                }
              >
                {status === "available" ? "Bo'sh" : "Band"}
              </Badge>
            </div>
            
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                Topshiriqlar: <span className="font-medium text-foreground">{currentTasks}</span>
              </p>
              {location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialistCard;
