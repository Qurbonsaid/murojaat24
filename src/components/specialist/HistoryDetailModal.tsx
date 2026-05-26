import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Clock, Image as ImageIcon } from "lucide-react";

import type { SpecialistHistoryItem } from "@/lib/api/assignments";
import { cn } from "@/lib/utils";

interface HistoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: SpecialistHistoryItem;
}

const ImageSection = ({
  title,
  images,
  emptyLabel,
  description,
}: {
  title: string;
  images: string[];
  emptyLabel: string;
  description?: string;
}) => (
  <div>
    <h4 className="font-semibold text-sm mb-2 text-foreground">{title}</h4>
    {images?.length > 0 ? (
      <div className="space-y-2">
        {images.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={`${title} ${index + 1}`}
            className="w-full max-h-48 object-cover rounded-lg border border-border"
          />
        ))}
      </div>
    ) : (
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-center h-24 text-center text-muted-foreground">
          <div>
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-60" />
            <p className="text-xs">{emptyLabel}</p>
          </div>
        </div>
        {description && description !== "—" ? (
          <p className="text-sm text-muted-foreground mt-3">{description}</p>
        ) : null}
      </div>
    )}
  </div>
);

const HistoryDetailModal = ({ open, onOpenChange, task }: HistoryDetailModalProps) => {
  const renderStars = (rating: number) => {
    if (rating <= 0) {
      return (
        <span className="text-sm text-muted-foreground">Baholanmagan</span>
      );
    }

    return (
      <>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
            )}
          />
        ))}
        <span className="text-sm font-medium text-foreground">{rating}/5</span>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{task.id}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {task.organization} · {task.completedDate}
          </p>
          <p className="text-sm text-muted-foreground">{task.address}</p>
        </DialogHeader>

        <div className="space-y-4">
          <ImageSection
            title="Dastlabki muammo"
            images={task.requestImages}
            emptyLabel="Rasm mavjud emas"
            description={task.description}
          />

          <ImageSection
            title="Bajarilgan ish"
            images={task.completionImages}
            emptyLabel="Bajarilgan ish rasmi mavjud emas"
          />

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Hisobot</h4>
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              {task.report}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">
              Fuqaro imzosi
            </h4>
            {task.signatureUrl ? (
              <img
                src={task.signatureUrl}
                alt="Fuqaro imzosi"
                className="w-full max-h-32 object-contain rounded-lg border border-border bg-white p-2"
              />
            ) : (
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-20 border-2 border-dashed border-border">
                <p className="text-xs text-muted-foreground italic">
                  Imzo mavjud emas
                </p>
              </div>
            )}
          </div>

          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Vaqt ma'lumotlari
              </span>
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

          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">
              Fuqaro bahosi
            </h4>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {renderStars(task.rating)}
            </div>
            {task.citizenComment ? (
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 italic">
                &ldquo;{task.citizenComment}&rdquo;
              </p>
            ) : null}
          </div>

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
