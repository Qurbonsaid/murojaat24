import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, CheckCircle, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TaskCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    requestNumber: string;
  };
  onComplete: () => void;
}

const TaskCompletionModal = ({ open, onOpenChange, task, onComplete }: TaskCompletionModalProps) => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [report, setReport] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !contextRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onComplete();
      onOpenChange(false);
      setStep(1);
      setImagePreview(null);
      setReport("");
    }, 2000);
  };

  const handleNext = () => {
    if (step === 1 && !imagePreview) {
      toast.error("Iltimos, rasm yuklang");
      return;
    }
    if (step === 2 && !report.trim()) {
      toast.error("Iltimos, hisobot yozing");
      return;
    }
    if (step === 3) {
      handleComplete();
      return;
    }
    setStep(step + 1);
    if (step === 2) {
      setTimeout(initCanvas, 100);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Ish muvaffaqiyatli yakunlandi!
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Ma'lumotlar menejerga yuborildi
            </p>
            <p className="text-sm font-medium text-primary">{task.requestNumber}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Ishni yakunlash ({step}/3)
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Photo Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bajarilgan ishning rasmini yuklang
            </p>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setImagePreview(null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Rasm yuklash uchun tugmalardan birini bosing
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button variant="default" className="w-full" asChild>
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    Kameradan tortish
                  </span>
                </Button>
              </label>
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Image className="h-4 w-4 mr-2" />
                    Galereyadan
                  </span>
                </Button>
              </label>
            </div>

            <Button className="w-full" onClick={handleNext}>
              Keyingi
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Report */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bajarilgan ishni qisqacha tasvirlab bering
            </p>

            <Textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Masalan: Rozetka almashtirildi, simlar tekshirildi va izolyatsiya qilindi..."
              className="min-h-32"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {report.length}/500
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                Keyingi
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Signature */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fuqaroning imzosini oling
            </p>

            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-40 bg-white border-2 border-border rounded-lg touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearSignature}
              >
                Tozalash
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Fuqaro ekranga barmog'i bilan imzo chizsin
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Yakunlash
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskCompletionModal;
