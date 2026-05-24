import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2, Phone } from "lucide-react";

import ImagePreviewDialog from "@/components/ImagePreviewDialog";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  formatRequestDateTime,
  getRequestPriorityLabel,
  resolveOrganizationName,
  useRequest,
} from "@/lib/api/requests";
import { formatPhoneInput } from "@/lib/phone";

type OperatorRequestDetailModalProps = {
  requestId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <div className="text-sm font-medium text-foreground">{children}</div>
  </div>
);

const OperatorRequestDetailModal = ({
  requestId,
  open,
  onOpenChange,
}: OperatorRequestDetailModalProps) => {
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const requestQuery = useRequest(open ? requestId : null);
  const organizationsQuery = useOrganizations();

  useEffect(() => {
    if (!open) setPreviewImage(null);
  }, [open]);

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);

  const request = requestQuery.data;
  const errorMessage =
    requestQuery.error instanceof ApiError
      ? requestQuery.error.message
      : requestQuery.error instanceof Error
        ? requestQuery.error.message
        : "Murojaat ma'lumotlarini yuklashda xatolik";

  const formattedPhone = request?.citizen?.phone
    ? formatPhoneInput(request.citizen.phone)
    : "—";

  const handleCall = () => {
    if (!request?.citizen?.phone) return;
    window.location.href = `tel:${request.citizen.phone.replace(/\s/g, "")}`;
  };

  return (
    <>
      <ImagePreviewDialog
        src={previewImage?.src ?? null}
        alt={previewImage?.alt}
        onClose={() => setPreviewImage(null)}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <DialogTitle className="text-xl leading-tight">
              {request?.requestNumber ?? "Murojaat tafsilotlari"}
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
          <div className="space-y-4">
            <DetailField label="Fuqaro">
              {request.citizen?.name ?? "—"}
            </DetailField>

            <DetailField label="Telefon">
              <div className="flex items-center justify-between gap-2">
                <span>{formattedPhone}</span>
                {request.citizen?.phone ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCall}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Qo&apos;ng&apos;iroq
                  </Button>
                ) : null}
              </div>
            </DetailField>

            <Separator />

            <DetailField label="Tashkilot">
              {resolveOrganizationName(
                request.organization,
                organizationNameById
              )}
            </DetailField>

            <DetailField label="Muhimlik">
              {getRequestPriorityLabel(request.priority)}
            </DetailField>

            <DetailField label="Muammo tavsifi">
              <p className="font-normal whitespace-pre-wrap">
                {request.description ?? "—"}
              </p>
            </DetailField>

            <DetailField label="Manzil">
              {request.address?.full ?? "—"}
            </DetailField>

            <DetailField label="Yaratilgan vaqt">
              {formatRequestDateTime(request.createdAt)}
            </DetailField>

            {request.images && request.images.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Rasmlar</p>
                <div className="grid grid-cols-2 gap-2">
                  {request.images.map((image, index) => {
                    const src = resolveAssetUrl(image);
                    if (!src) return null;
                    const alt = `Murojaat rasmi ${index + 1}`;
                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className="h-32 w-full overflow-hidden rounded-lg border border-border bg-muted/30 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => setPreviewImage({ src, alt })}
                        aria-label={`${alt} — kattalashtirish`}
                      >
                        <img
                          src={src}
                          alt={alt}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {request.timeline && request.timeline.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tarix</p>
                <ul className="space-y-2">
                  {[...request.timeline].reverse().map((entry, index) => (
                    <li
                      key={`${entry.status}-${entry.timestamp ?? index}`}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <RequestStatusBadge status={entry.status} />
                        <span className="text-muted-foreground text-xs">
                          {formatRequestDateTime(entry.timestamp)}
                        </span>
                      </div>
                      {entry.comment ? (
                        <p className="mt-2 text-muted-foreground">
                          {entry.comment}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Murojaat tanlanmagan
          </p>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default OperatorRequestDetailModal;
