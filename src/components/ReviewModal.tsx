import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    requestNumber: string;
    specialist: string;
    address: string;
    beforeImage?: string;
    afterImage?: string;
    report: string;
    assignedTime: string;
    startedTime: string;
    completedTime: string;
  };
}

const ReviewModal = ({ open, onOpenChange, request }: ReviewModalProps) => {
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: "Tasdiqlandi",
      description: `Murojaat ${request.requestNumber} tasdiqlandi`,
    });
    onOpenChange(false);
  };

  const handleReject = () => {
    toast({
      title: "Rad etildi",
      description: `Murojaat ${request.requestNumber} rad etildi`,
      variant: "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nazorat qilish - {request.requestNumber}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Before */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Dastlabki muammo</h3>
            
            {request.beforeImage && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={request.beforeImage} 
                  alt="Before" 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Manzil:</p>
              <p className="text-foreground">{request.address}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mutaxassis:</p>
              <p className="text-foreground font-medium">{request.specialist}</p>
            </div>
          </div>

          {/* Right Column - After */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Bajarilgan ish</h3>
            
            {request.afterImage && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={request.afterImage} 
                  alt="After" 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mutaxassis hisoboti:</p>
              <Textarea 
                value={request.report}
                readOnly
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Fuqaro imzosi:</p>
              <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                <p className="text-sm text-muted-foreground italic">Imzo mavjud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Tayinlangan: <span className="font-medium text-foreground">{request.assignedTime}</span>
            </span>
            <span className="mx-2">|</span>
            <span>
              Boshlangan: <span className="font-medium text-foreground">{request.startedTime}</span>
            </span>
            <span className="mx-2">|</span>
            <span>
              Tugagan: <span className="font-medium text-foreground">{request.completedTime}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleReject}
          >
            Rad etish
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
          >
            Tasdiqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
