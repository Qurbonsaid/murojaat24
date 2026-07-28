import { MapPinOff } from "lucide-react";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Termo24Map, {
  type Termo24MapPoint,
} from "@/components/termo24/Termo24Map";
import { useTermo24Devices } from "@/lib/api/termo24";

const isValidCoordinate = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) && value !== 0;

const calculateGeometricCenter = (points: Termo24MapPoint[]) => {
  if (points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    return points[0];
  }

  const total = points.reduce(
    (accumulator, point) => ({
      lat: accumulator.lat + point.lat,
      lng: accumulator.lng + point.lng,
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length,
  };
};

const MapSection = () => {
  const devicesQuery = useTermo24Devices({ refetchInterval: 20_000 });

  const mapPoints = useMemo<Termo24MapPoint[]>(
    () =>
      devicesQuery.data
        ?.filter(
          (device) =>
            isValidCoordinate(device.address.coordinates.lat) &&
            isValidCoordinate(device.address.coordinates.lng),
        )
        .map((device) => ({
          lat: device.address.coordinates.lat,
          lng: device.address.coordinates.lng,
          label: device.name?.trim() || "Nomlanmagan qurilma",
          description: device.address.full?.trim() || "Manzil kiritilmagan",
          status: device.status,
          input: device.input,
          output: device.output,
          updatedAt: device.updatedAt,
        })) ?? [],
    [devicesQuery.data],
  );

  const mapCenter = useMemo(() => {
    const geometricCenter = calculateGeometricCenter(mapPoints);

    if (geometricCenter) {
      return {
        lat: geometricCenter.lat,
        lng: geometricCenter.lng,
        label: "Qurilmalar markazi",
      };
    }

    return {
      lat: 37.2242,
      lng: 67.2788,
      label: "Termiz shahri",
    };
  }, [mapPoints]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xarita</CardTitle>
        <CardDescription>
          Termo24 qurilmalarining joylashuvi Termiz shahri markazidan boshlab
          ko'rsatiladi.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {devicesQuery.isLoading ? (
          <p className="py-10 text-sm text-muted-foreground">
            Qurilmalar xaritaga yuklanmoqda...
          </p>
        ) : devicesQuery.isError ? (
          <p className="py-10 text-sm text-destructive">
            Xarita uchun qurilmalarni yuklashda xatolik yuz berdi.
          </p>
        ) : (
          <>
            <div className="grid gap-3 rounded-xl border bg-muted/20 p-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Markaz
                </p>
                <p className="font-medium text-foreground">Termiz shahri</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Ko'rinayotgan nuqtalar
                </p>
                <p className="font-medium text-foreground">
                  {mapPoints.length}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Qamrov
                </p>
                <p className="font-medium text-foreground">Yandex tiles API</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-slate-950">
              <Termo24Map
                className="h-[700px] w-full"
                center={mapCenter}
                points={mapPoints}
              />
            </div>

            {mapPoints.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                <MapPinOff className="h-4 w-4" />
                Hozircha koordinatalari mavjud qurilmalar topilmadi.
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MapSection;
