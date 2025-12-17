import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Clock, Image } from "lucide-react";

interface HistoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    organization: string;
    address: string;
    completedDate: string;
    completedTime: string;
    duration: string;
    rating: number;
    citizenComment: string;
    report: string;
    startTime: string;
    endTime: string;
  };
}

const HistoryDetailModal = ({ open, onOpenChange, task }: HistoryDetailModalProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{task.id}</DialogTitle>
          <p className="text-sm text-muted-foreground">{task.completedDate}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Problem Section */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Dastlabki muammo</h4>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-32">
              <div className="text-center text-muted-foreground">
                <Image className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">Rasm mavjud emas</p>
              </div>
            </div>
          </div>

          {/* Completed Work Section */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Bajarilgan ish</h4>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-32">
              <div className="text-center text-muted-foreground">
                <Image className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">Bajarilgan ish rasmi</p>
              </div>
            </div>
          </div>

          {/* Report */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Hisobot</h4>
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              {task.report}
            </p>
          </div>

          {/* Citizen Signature */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Fuqaro imzosi</h4>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-20 border-2 border-dashed border-border">
              <p className="text-xs text-muted-foreground italic">Imzo mavjud</p>
            </div>
          </div>

          {/* Time Info */}
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Vaqt ma'lumotlari</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Boshlangan:</span>
              <span className="font-medium text-foreground">{task.startTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tugagan:</span>
              <span className="font-medium text-foreground">{task.endTime}</span>
            </div>
            <div className="flex justify-between text-sm mt-1 pt-1 border-t border-border">
              <span className="text-muted-foreground">Davomiyligi:</span>
              <span className="font-medium text-green-600">{task.duration}</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Fuqaro bahosi</h4>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(task.rating)}
              <span className="text-sm font-medium text-foreground">{task.rating}/5</span>
            </div>
            {task.citizenComment && (
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 italic">
                "{task.citizenComment}"
              </p>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Yopish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDetailModal;
