import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Specialist {
  id: string;
  name: string;
  distance: string;
  currentLoad: string;
  rating: number;
  recommended?: boolean;
}

interface AssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestNumber: string;
}

const specialists: Specialist[] = [
  {
    id: "1",
    name: "Akmal Rahimov",
    distance: "2.3 km",
    currentLoad: "2 ta ochiq topshiriq",
    rating: 4.8,
    recommended: true,
  },
  {
    id: "2",
    name: "Bobur Toshmatov",
    distance: "4.1 km",
    currentLoad: "3 ta ochiq topshiriq",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Davron Yusupov",
    distance: "5.8 km",
    currentLoad: "1 ta ochiq topshiriq",
    rating: 4.7,
  },
];

const AssignModal = ({ open, onOpenChange, requestNumber }: AssignModalProps) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const { toast } = useToast();

  const handleAssign = () => {
    const specialist = specialists.find(s => s.id === selectedSpecialist);
    if (specialist) {
      toast({
        title: "Tayinlandi",
        description: `Murojaat ${specialist.name}ga tayinlandi`,
      });
      onOpenChange(false);
      setSelectedSpecialist("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mutaxassisni tanlang</DialogTitle>
          <DialogDescription>
            Murojaat: <span className="font-semibold text-foreground">{requestNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedSpecialist} onValueChange={setSelectedSpecialist} className="space-y-3">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedSpecialist === specialist.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedSpecialist(specialist.id)}
            >
              <RadioGroupItem value={specialist.id} id={specialist.id} className="mt-1" />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {specialist.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor={specialist.id} className="font-semibold cursor-pointer">
                        {specialist.name}
                      </Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{specialist.rating}</span>
                      </div>
                    </div>
                  </div>
                  {specialist.recommended && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                      Tavsiya etiladi
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-xs text-muted-foreground pl-[52px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{specialist.distance}</span>
                  </div>
                  <div>
                    <span>{specialist.currentLoad}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Bekor qilish
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedSpecialist}
            className="flex-1"
          >
            Tayinlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
