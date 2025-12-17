import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, CheckCircle } from "lucide-react";

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    requestNumber: string;
    organization: string;
    description: string;
    address: string;
    phone: string;
    imageUrl?: string;
    status: "new" | "in-progress";
  };
  onAccept?: () => void;
  onStartCompletion?: () => void;
}

const TaskDetailModal = ({ open, onOpenChange, task, onAccept, onStartCompletion }: TaskDetailModalProps) => {
  const handleCall = () => {
    window.location.href = `tel:${task.phone.replace(/\s/g, '')}`;
  };

  const handleNavigation = () => {
    const encodedAddress = encodeURIComponent(task.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{task.requestNumber}</DialogTitle>
            <Badge className={task.status === "new" ? "bg-blue-500" : "bg-yellow-500"}>
              {task.status === "new" ? "Yangi" : "Jarayonda"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organization */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Tashkilot</h4>
            <p className="text-sm text-foreground">{task.organization}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Muammo tavsifi</h4>
            <p className="text-foreground">{task.description}</p>
          </div>

          {task.imageUrl && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Rasm</h4>
              <img 
                src={task.imageUrl} 
                alt="Problem" 
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Manzil</h4>
              <div className="flex items-start gap-2 text-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-sm">{task.address}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Telefon</h4>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{task.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button variant="outline" className="w-full" size="lg" onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" />
              Qo'ng'iroq qilish
            </Button>
            <Button 
              variant="secondary" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              size="lg"
              onClick={handleNavigation}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Navigatsiyani boshlash
            </Button>
            {task.status === "new" && onAccept && (
              <Button className="w-full" size="lg" onClick={onAccept}>
                Qabul qilish
              </Button>
            )}
            {task.status === "in-progress" && onStartCompletion && (
              <Button className="w-full" size="lg" onClick={onStartCompletion}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Ishni yakunlash
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
