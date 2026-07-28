import { useMemo, useState } from "react";
import { PencilLine } from "lucide-react";
import { differenceInMinutes, format, isValid, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type {
  Termo24DeviceUpdateInput,
  Termo24Device,
} from "@/lib/api/termo24";
import { useTermo24Devices, useUpdateTermo24Device } from "@/lib/api/termo24";

import EditTermo24DeviceModal from "@/components/EditTermo24DeviceModal";

const formatRatingDate = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) return "—";
  const parsed = parseISO(value);
  if (!isValid(parsed)) return value.trim();
  return format(parsed, "HH:mm:ss dd.MM.yyyy");
};

const isStaleUpdate = (timestamp?: string) => {
  if (!timestamp) return false;

  const parsedValue = parseISO(timestamp);
  if (Number.isNaN(parsedValue.getTime())) return false;

  return differenceInMinutes(new Date(), parsedValue) > 30;
};

const DevicesSection = () => {
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const { toast } = useToast();
  const devicesQuery = useTermo24Devices({
    refetchInterval: editingDeviceId ? false : 20_000,
  });
  const updateDevice = useUpdateTermo24Device();

  const editingDevice = useMemo(
    () =>
      devicesQuery.data?.find((device) => device._id === editingDeviceId) ??
      null,
    [devicesQuery.data, editingDeviceId],
  );

  const handleSave = async (
    updatedDevice: Termo24DeviceUpdateInput & { updatedAt?: string },
  ) => {
    try {
      await updateDevice.mutateAsync(updatedDevice);
      toast({
        title: "Saqlandi",
        description: "Qurilma ma'lumotlari yangilandi",
      });
      setEditingDeviceId(null);
    } catch {
      toast({
        title: "Xatolik",
        description: "Qurilmani yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
      throw new Error("Qurilmani yangilashda xatolik yuz berdi");
    }
  };

  const devices = devicesQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qurilmalar</CardTitle>
        <CardDescription>
          Termo24 qurilmalarini ko'rish va tahrirlash.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {devicesQuery.isLoading ? (
          <p className="py-8 text-sm text-muted-foreground">
            Qurilmalar yuklanmoqda...
          </p>
        ) : devicesQuery.isError ? (
          <p className="py-8 text-sm text-destructive">
            Qurilmalarni yuklashda xatolik yuz berdi.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead>Kirish harorati</TableHead>
                <TableHead>Chiqish harorati</TableHead>
                <TableHead>To'liq manzil</TableHead>
                <TableHead>Yangilanish</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                const displayName = device.name?.trim() || "Nomlanmagan";
                const fullAddress =
                  device.address.full?.trim() || "Manzil kiritilmagan";

                return (
                  <TableRow key={device._id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <span title={displayName}>{displayName}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {device.status === "both_fault" ||
                      isStaleUpdate(device.timestamp) ? (
                        <Badge variant="destructive">Uzilgan</Badge>
                      ) : device.status === "ok" ? (
                        <Badge variant="default">Normal</Badge>
                      ) : (
                        <Badge variant="secondary">Nosoz sensor</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {device.input.toFixed(2)}°C
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {device.output.toFixed(2)}°C
                    </TableCell>
                    <TableCell className="max-w-[28rem] truncate whitespace-nowrap">
                      <span title={fullAddress}>{fullAddress}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatRatingDate(device.updatedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label="Tahrirlash"
                        title="Tahrirlash"
                        onClick={() => setEditingDeviceId(device._id)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <EditTermo24DeviceModal
        open={Boolean(editingDevice)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingDeviceId(null);
          }
        }}
        device={editingDevice}
        onSave={handleSave}
        isSaving={updateDevice.isPending}
      />
    </Card>
  );
};

export default DevicesSection;
