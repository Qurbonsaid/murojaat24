import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import ImagePreviewDialog from "@/components/ImagePreviewDialog";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Assignment, AssignmentUserRef } from "@/lib/api/assignments";
import { resolveAssignmentSpecialistName } from "@/lib/api/assignments";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import {
  formatRequestDateTime,
  useRequest,
  useVerifyRequest,
} from "@/lib/api/requests";

type ReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
};

const resolveAssignmentFromRequest = (
  assignment: unknown,
): Assignment | undefined => {
  if (!assignment || typeof assignment !== "object") return undefined;
  return assignment as Assignment;
};

const ReviewModal = ({ open, onOpenChange, requestId }: ReviewModalProps) => {
  const { toast } = useToast();
  const [rejectComment, setRejectComment] = useState("");
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const requestQuery = useRequest(open ? requestId : null);
  const verifyRequest = useVerifyRequest();
  const request = requestQuery.data;
  const assignment = resolveAssignmentFromRequest(request?.assignment);

  useEffect(() => {
    if (!open) {
      setRejectComment("");
      setPreviewImage(null);
    }
  }, [open]);

  const specialistName = useMemo(
    () =>
      resolveAssignmentSpecialistName(
        assignment?.specialist as AssignmentUserRef | undefined,
        new Map(),
      ),
    [assignment?.specialist],
  );

  const imageUrls = useMemo(
    () =>
      (request?.images ?? [])
        .map((image) => resolveAssetUrl(image))
        .filter((url): url is string => Boolean(url)),
    [request?.images],
  );

  const beforeImage = imageUrls[0];
  const afterImage = imageUrls.length > 1 ? imageUrls[1] : imageUrls[0];

  const timelineEntries = useMemo(() => {
    const entries = [...(request?.timeline ?? [])];
    if (assignment?.assignedAt) {
      entries.push({
        status: "assigned",
        timestamp: assignment.assignedAt,
        comment: null,
      });
    }
    if (assignment?.completedAt) {
      entries.push({
        status: "completed",
        timestamp: assignment.completedAt,
        comment: null,
      });
    }
    return entries.sort((a, b) => {
      const aTime = a.timestamp ? Date.parse(a.timestamp) : 0;
      const bTime = b.timestamp ? Date.parse(b.timestamp) : 0;
      return aTime - bTime;
    });
  }, [assignment?.assignedAt, assignment?.completedAt, request?.timeline]);

  const canReview = request?.status === "completed";
  const isSubmitting = verifyRequest.isPending;

  const errorMessage =
    requestQuery.error instanceof ApiError
      ? requestQuery.error.message
      : requestQuery.error instanceof Error
        ? requestQuery.error.message
        : "Murojaat ma'lumotlarini yuklashda xatolik";

  const handleVerify = async (status: "approved" | "rejected") => {
    if (!requestId) return;

    try {
      await verifyRequest.mutateAsync({
        id: requestId,
        status,
        ...(status === "rejected" && rejectComment.trim()
          ? { comment: rejectComment.trim() }
          : {}),
      });

      toast({
        title: status === "approved" ? "Tasdiqlandi" : "Rad etildi",
        description:
          status === "approved"
            ? `Murojaat ${request?.requestNumber ?? ""} tasdiqlandi`
            : `Murojaat ${request?.requestNumber ?? ""} rad etildi`,
        variant: status === "rejected" ? "destructive" : "default",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
          error instanceof ApiError
            ? error.message
            : "Nazorat amalini bajarishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ImagePreviewDialog
        src={previewImage?.src ?? null}
        alt={previewImage?.alt}
        onClose={() => setPreviewImage(null)}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3 pr-6">
              <DialogTitle className="text-2xl">
                Nazorat qilish — {request?.requestNumber ?? "..."}
              </DialogTitle>
              {request?.status ? (
                <RequestStatusBadge status={request.status} />
              ) : null}
            </div>
          </DialogHeader>

          {requestQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requestQuery.isError ? (
            <p className="text-center text-destructive py-8">{errorMessage}</p>
          ) : request ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Dastlabki muammo
                  </h3>

                  {beforeImage ? (
                    <button
                      type="button"
                      className="w-full rounded-lg overflow-hidden border border-border"
                      onClick={() =>
                        setPreviewImage({ src: beforeImage, alt: "Dastlabki holat" })
                      }
                    >
                      <img
                        src={beforeImage}
                        alt="Dastlabki holat"
                        className="w-full h-64 object-cover"
                      />
                    </button>
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Manzil:</p>
                    <p className="text-foreground">{request.address?.full ?? "—"}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Mutaxassis:</p>
                    <p className="text-foreground font-medium">{specialistName}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Fuqaro:</p>
                    <p className="text-foreground">{request.citizen?.name ?? "—"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Bajarilgan ish
                  </h3>

                  {afterImage && afterImage !== beforeImage ? (
                    <button
                      type="button"
                      className="w-full rounded-lg overflow-hidden border border-border"
                      onClick={() =>
                        setPreviewImage({ src: afterImage, alt: "Bajarilgan ish" })
                      }
                    >
                      <img
                        src={afterImage}
                        alt="Bajarilgan ish"
                        className="w-full h-64 object-cover"
                      />
                    </button>
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Muammo tavsifi:</p>
                    <Textarea
                      value={request.description ?? ""}
                      readOnly
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {timelineEntries.length > 0 ? (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-foreground">Vaqt chizig&apos;i</p>
                  <ul className="space-y-2">
                    {timelineEntries.map((entry, index) => (
                      <li
                        key={`${entry.status}-${entry.timestamp ?? index}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                      >
                        <RequestStatusBadge status={entry.status} />
                        <span className="text-muted-foreground">
                          {formatRequestDateTime(entry.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {canReview ? (
                <div className="mt-6 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Rad etish sababi (ixtiyoriy)
                    </p>
                    <Textarea
                      value={rejectComment}
                      onChange={(event) => setRejectComment(event.target.value)}
                      placeholder="Rad etish sababini yozing..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      disabled={isSubmitting}
                      onClick={() => void handleVerify("rejected")}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Rad etish"
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                      onClick={() => void handleVerify("approved")}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Tasdiqlash"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  Faqat &quot;Yakunlangan&quot; holatidagi murojaatlarni tasdiqlash yoki rad
                  etish mumkin.
                </p>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewModal;
