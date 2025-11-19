import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  trackingNumber: string;
}

const SuccessModal = ({ open, onClose, trackingNumber }: SuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-secondary/10 p-3">
              <CheckCircle2 className="h-16 w-16 text-secondary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Murojaat muvaffaqiyatli yuborildi!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Murojaat raqamingiz:
            </p>
            <p className="text-2xl font-bold text-primary">{trackingNumber}</p>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            SMS orqali tasdiqlash yuborildi
          </p>
          <Button onClick={onClose} className="w-full" size="lg">
            Yopish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
