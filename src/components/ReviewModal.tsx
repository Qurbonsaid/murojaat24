import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import ImagePreviewDialog from "@/components/ImagePreviewDialog";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Assignment, AssignmentUserRef } from "@/lib/api/assignments";
import { resolveAssignmentSpecialistName } from "@/lib/api/assignments";
import { useCurrentUser } from "@/lib/api/auth";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  formatRequestDateTime,
  resolveOrganizationName,
  useRequest,
  useReturnRequestForWrongOrganization,
  useVerifyRequest,
} from "@/lib/api/requests";

type ReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
};

const resolveAssignmentFromRequest = (
  assignment: unknown
): Assignment | undefined => {
  if (!assignment || typeof assignment !== "object") return undefined;
  return assignment as Assignment;
};

const resolveImageUrls = (paths: string[] | undefined): string[] =>
  (paths ?? [])
    .map((image) => resolveAssetUrl(image))
    .filter((url): url is string => Boolean(url));

const ReviewModal = ({ open, onOpenChange, requestId }: ReviewModalProps) => {
  const { toast } = useToast();
  const [rejectComment, setRejectComment] = useState("");
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const currentUserQuery = useCurrentUser();
  const organizationsQuery = useOrganizations();
  const requestQuery = useRequest(open ? requestId : null);
  const verifyRequest = useVerifyRequest();
  const returnRequest = useReturnRequestForWrongOrganization();
  const request = requestQuery.data;
  const assignment = resolveAssignmentFromRequest(request?.assignment);
  const completionData = request?.completionData;

  useEffect(() => {
    if (!open) {
      setRejectComment("");
      setReturnDialogOpen(false);
      setPreviewImage(null);
    }
  }, [open]);

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);

  const specialistName = useMemo(
    () =>
      resolveAssignmentSpecialistName(
        assignment?.specialist as AssignmentUserRef | undefined,
        new Map()
      ),
    [assignment?.specialist]
  );

  const initialImageUrls = useMemo(
    () => resolveImageUrls(request?.images),
    [request?.images]
  );

  const completionImageUrls = useMemo(
    () => resolveImageUrls(completionData?.images),
    [completionData?.images]
  );

  const signatureUrl = completionData?.signature
    ? resolveAssetUrl(completionData.signature)
    : undefined;

  const timelineEntries = useMemo(() => {
    const entries = [...(request?.timeline ?? [])];
    if (assignment?.assignedAt) {
      entries.push({
        status: "assigned",
        timestamp: assignment.assignedAt,
        comment: null,
      });
    }
    const completedAt =
      completionData?.completedAt ?? assignment?.completedAt ?? null;
    if (completedAt) {
      entries.push({
        status: "completed",
        timestamp: completedAt,
        comment: null,
      });
    }
    return entries.sort((a, b) => {
      const aTime = a.timestamp ? Date.parse(a.timestamp) : 0;
      const bTime = b.timestamp ? Date.parse(b.timestamp) : 0;
      return aTime - bTime;
    });
  }, [
    assignment?.assignedAt,
    assignment?.completedAt,
    completionData?.completedAt,
    request?.timeline,
  ]);

  const canReview = request?.status === "completed";
  const isManager = currentUserQuery.data?.role === "manager";
  const canShowWrongOrgCard =
    isManager &&
    request &&
    request.status !== "verified" &&
    request.status !== "rejected";
  const organizationName = resolveOrganizationName(
    request?.organization,
    organizationNameById,
  );
  const isSubmitting = verifyRequest.isPending || returnRequest.isPending;

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

  const handleReturnToOperator = async () => {
    if (!requestId) return;

    try {
      await returnRequest.mutateAsync(requestId);
      toast({
        title: "Murojaat operatorga qaytarildi",
      });
      setReturnDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description:
          error instanceof ApiError
            ? error.message
            : "Murojaatni operatorga qaytarishda xatolik yuz berdi",
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
            {request?.incorrectOrganization ? (
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Bu murojaat menejer tomonidan tashkilot noto&apos;g&apos;ri
                tanlangani sababli qaytarilgan
              </p>
            ) : null}
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

                  {initialImageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {initialImageUrls.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          className="overflow-hidden rounded-lg border border-border"
                          onClick={() =>
                            setPreviewImage({
                              src,
                              alt: `Dastlabki holat ${index + 1}`,
                            })
                          }
                        >
                          <img
                            src={src}
                            alt={`Dastlabki holat ${index + 1}`}
                            className="h-32 w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Manzil:</p>
                    <p className="text-foreground">
                      {request.address?.full ?? "—"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Mutaxassis:</p>
                    <p className="text-foreground font-medium">
                      {specialistName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Fuqaro:</p>
                    <p className="text-foreground">
                      {request.citizen?.name ?? "—"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Muammo tavsifi:
                    </p>
                    <p className="whitespace-pre-wrap text-foreground">
                      {request.description?.trim() || "—"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Bajarilgan ish
                  </h3>

                  {completionData?.completedAt ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Yakunlangan vaqt:
                      </p>
                      <p className="text-foreground">
                        {formatRequestDateTime(completionData.completedAt)}
                      </p>
                    </div>
                  ) : null}

                  {completionImageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {completionImageUrls.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          className="overflow-hidden rounded-lg border border-border"
                          onClick={() =>
                            setPreviewImage({
                              src,
                              alt: `Bajarilgan ish ${index + 1}`,
                            })
                          }
                        >
                          <img
                            src={src}
                            alt={`Bajarilgan ish ${index + 1}`}
                            className="h-32 w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Mutaxassis hisoboti:
                    </p>
                    <p className="whitespace-pre-wrap text-foreground">
                      {completionData?.report?.trim() || "—"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Fuqaro imzosi:
                    </p>
                    {signatureUrl ? (
                      <button
                        type="button"
                        className="w-full overflow-hidden rounded-lg border border-border"
                        onClick={() =>
                          setPreviewImage({
                            src: signatureUrl,
                            alt: "Fuqaro imzosi",
                          })
                        }
                      >
                        <img
                          src={signatureUrl}
                          alt="Fuqaro imzosi"
                          className="h-24 w-full object-contain bg-muted/30"
                        />
                      </button>
                    ) : (
                      <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                        <p className="text-sm italic text-muted-foreground">
                          Imzo mavjud emas
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {timelineEntries.length > 0 ? (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Vaqt chizig&apos;i
                  </p>
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

              {canShowWrongOrgCard ? (
                <div
                  className={cn(
                    "mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30",
                    request.incorrectOrganization && "hidden",
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">
                        Tashkilot noto&apos;g&apos;ri tanlanganmi?
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Agar murojaat sizning tashkilotingizga tegishli
                        bo&apos;lmasa, uni operatorga qaytaring. Operator
                        murojaatni boshqa tashkilotga qayta biriktiradi.
                      </p>
                      <p className="text-sm text-foreground">
                        Joriy tashkilot:{" "}
                        <span className="font-medium">{organizationName}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-amber-300 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-800 dark:hover:bg-amber-950/50 dark:hover:text-amber-200"
                      disabled={isSubmitting}
                      onClick={() => setReturnDialogOpen(true)}
                    >
                      Operatorga qaytarish
                    </Button>
                  </div>
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
                      className="flex-1 border-red-500 text-red-500 hover:text-red-900 hover:bg-red-50"
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
                  Faqat yakunlangan tayinlashlar uchun tasdiqlash yoki rad etish
                  mumkin.
                </p>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Murojaatni operatorga qaytarish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu murojaat operatorga qaytariladi va boshqa tashkilotga qayta
              biriktiriladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={returnRequest.isPending}>
              Bekor qilish
            </AlertDialogCancel>
            <Button
              disabled={returnRequest.isPending}
              onClick={() => void handleReturnToOperator()}
            >
              {returnRequest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Qaytarilmoqda...
                </>
              ) : (
                "Qaytarish"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewModal;
