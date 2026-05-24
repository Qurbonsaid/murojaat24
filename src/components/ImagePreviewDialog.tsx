import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type ImagePreviewDialogProps = {
  src: string | null;
  alt?: string;
  onClose: () => void;
};

const ImagePreviewDialog = ({
  src,
  alt = "Rasm",
  onClose,
}: ImagePreviewDialogProps) => {
  return (
    <Dialog
      open={Boolean(src)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[min(96vw,56rem)] gap-0 overflow-hidden p-2 sm:p-3">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] w-full rounded-md object-contain"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
