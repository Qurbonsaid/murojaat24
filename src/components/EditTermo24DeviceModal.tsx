import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  Termo24Device,
  Termo24DeviceUpdateInput,
} from "@/lib/api/termo24";

type DeviceFormState = {
  name?: string;
  address?: {
    full?: string;
    street?: string;
    house?: string;
    coordinates?: {
      lat?: string;
      lng?: string;
    };
  };
  quarter?: string;
  sector?: string;
};

interface EditTermo24DeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Termo24Device | null;
  onSave: (
    device: Termo24DeviceUpdateInput & { updatedAt?: string },
  ) => Promise<void> | void;
  isSaving?: boolean;
}

const defaultFormState: DeviceFormState = {
  name: "",
  address: {
    full: "",
    street: "",
    house: "",
    coordinates: {
      lat: "41.3111",
      lng: "69.2797",
    },
  },
  quarter: "",
  sector: "",
};

const buildMapUrl = (latitude?: string, longitude?: string) => {
  const fallbackLatitude =
    latitude?.trim() || defaultFormState.address?.coordinates?.lat || "41.3111";
  const fallbackLongitude =
    longitude?.trim() ||
    defaultFormState.address?.coordinates?.lng ||
    "69.2797";

  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${fallbackLatitude},${fallbackLongitude}`,
  )}&z=15&output=embed`;
};

const EditTermo24DeviceModal = ({
  open,
  onOpenChange,
  device,
  onSave,
  isSaving = false,
}: EditTermo24DeviceModalProps) => {
  const [formState, setFormState] = useState<DeviceFormState>(defaultFormState);

  useEffect(() => {
    if (!open || !device) return;

    setFormState({
      name: device.name ?? "",
      address: {
        full: device.address.full ?? "",
        street: device.address.street ?? "",
        house: device.address.house ?? "",
        coordinates: defaultFormState.address?.coordinates,
      },
      quarter: device.quarter,
      sector: device.sector,
    });
  }, [device, open]);

  const mapSrc = useMemo(
    () =>
      buildMapUrl(
        formState.address?.coordinates?.lat,
        formState.address?.coordinates?.lng,
      ),
    [formState.address?.coordinates?.lat, formState.address?.coordinates?.lng],
  );

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!device) return;

    await onSave({
      id: device._id,
      name: formState.name?.trim() || null,
      address: {
        full: formState.address?.full?.trim() || null,
        street: formState.address?.street?.trim() || null,
        house: formState.address?.house?.trim() || null,
        coordinates: {
          lat: device.address.coordinates.lat,
          lng: device.address.coordinates.lng,
        },
      },
      quarter: formState.quarter?.trim() || null,
      sector: formState.sector?.trim() || null,
    });

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Qurilmani tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Nomi</Label>
              <Input
                id="device-name"
                value={formState.name ?? ""}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    name: event.target.value,
                  }))
                }
                placeholder="Qurilma nomi"
              />
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold text-foreground">Manzil</p>

              <div className="space-y-2">
                <Label htmlFor="address-full">To'liq manzil</Label>
                <Input
                  id="address-full"
                  value={formState.address?.full ?? ""}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      address: {
                        ...currentState.address,
                        full: event.target.value,
                      },
                    }))
                  }
                  placeholder="To'liq manzil"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address-street">Ko'cha</Label>
                  <Input
                    id="address-street"
                    value={formState.address?.street ?? ""}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        address: {
                          ...currentState.address,
                          street: event.target.value,
                        },
                      }))
                    }
                    placeholder="Ko'cha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address-house">Uy</Label>
                  <Input
                    id="address-house"
                    value={formState.address?.house ?? ""}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        address: {
                          ...currentState.address,
                          house: event.target.value,
                        },
                      }))
                    }
                    placeholder="Uy raqami"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quarter">Mahalla</Label>
                <Input
                  id="quarter"
                  value={formState.quarter ?? ""}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      quarter: event.target.value,
                    }))
                  }
                  placeholder="Mahalla"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={formState.sector ?? ""}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      sector: event.target.value,
                    }))
                  }
                  placeholder="Sector"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Xarita</p>
              <p className="text-sm text-muted-foreground">
                Kenglik va uzunlik maydonlarini o'zgartirib, xarita previewini
                yangilang.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border bg-muted/20">
              <iframe
                title="Termo24 device map preview"
                src={mapSrc}
                className="h-[320px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Koordinata tanlash faqat simulyatsiya qilingan. Hozircha xarita
              previewi Google Maps iframe orqali ko'rsatiladi.
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTermo24DeviceModal;
