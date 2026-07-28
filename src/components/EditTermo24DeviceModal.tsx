import { useEffect, useState } from "react";

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
import Termo24Map from "@/components/termo24/Termo24Map";
import type {
  Termo24Device,
  Termo24DeviceUpdateInput,
} from "@/lib/api/termo24";

type SelectedCoordinates = {
  lat: number;
  lng: number;
};

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
      lat: "",
      lng: "",
    },
  },
  quarter: "",
  sector: "",
};

const normalizeText = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeCoordinate = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const isValidDeviceCoordinate = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) && value !== 0;

const defaultMapCenter = {
  lat: 37.2242,
  lng: 67.2788,
  label: "Termiz shahri",
  description: "Qurilma koordinatalari mavjud emas",
};

const EditTermo24DeviceModal = ({
  open,
  onOpenChange,
  device,
  onSave,
  isSaving = false,
}: EditTermo24DeviceModalProps) => {
  const [formState, setFormState] = useState<DeviceFormState>(defaultFormState);
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<SelectedCoordinates | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);

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

    const latitude = device.address.coordinates.lat;
    const longitude = device.address.coordinates.lng;
    const deviceCenter =
      isValidDeviceCoordinate(latitude) && isValidDeviceCoordinate(longitude)
        ? { lat: latitude, lng: longitude }
        : null;

    if (deviceCenter) {
      setMapCenter({
        lat: deviceCenter.lat,
        lng: deviceCenter.lng,
        label: device.name?.trim() || "Qurilma",
        description: device.address.full?.trim() || "Qurilma joylashuvi",
      });
      setSelectedCoordinates(deviceCenter);
      return;
    }

    let cancelled = false;
    setSelectedCoordinates(null);
    setMapCenter(defaultMapCenter);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;

          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: "Mening joylashuvim",
            description: "Brauzer joylashuvi",
          };

          setMapCenter(currentLocation);
          setSelectedCoordinates(null);
        },
        () => {
          if (cancelled) return;

          setMapCenter(defaultMapCenter);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
      );
    }

    return () => {
      cancelled = true;
    };
  }, [device, open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!device) return;

    await onSave({
      id: device._id,
      name: normalizeText(formState.name),
      address: {
        full: normalizeText(formState.address?.full),
        street: normalizeText(formState.address?.street),
        house: normalizeText(formState.address?.house),
        coordinates: {
          lat: normalizeCoordinate(selectedCoordinates?.lat),
          lng: normalizeCoordinate(selectedCoordinates?.lng),
        },
      },
      quarter: normalizeText(formState.quarter),
      sector: normalizeText(formState.sector),
    });

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Qurilmani tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5">
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

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Xarita</p>
            <div className="overflow-hidden rounded-xl border bg-muted/20">
              <Termo24Map
                className="h-[460px] w-full"
                center={mapCenter}
                selectionMode
                showLocateControl
                onSelectionChange={(point) => {
                  setSelectedCoordinates(point);
                  setMapCenter({
                    lat: point.lat,
                    lng: point.lng,
                    label: "Tanlangan joy",
                    description: "Tanlangan koordinata",
                  });
                }}
                onSelectionClear={() => {
                  setSelectedCoordinates(null);
                  setMapCenter(defaultMapCenter);
                }}
              />
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
