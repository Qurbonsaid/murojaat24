import { useEffect, useState } from "react";

import { format, parseISO } from "date-fns";

import { LocateFixed, Trash2 } from "lucide-react";
import { divIcon } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { cn } from "@/lib/utils";

const YANDEX_TILES_URL =
  "https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=uz_UZ&apikey=3934da88-2336-4f93-aa8c-928e6c129733";

export type Termo24MapPoint = {
  lat: number;
  lng: number;
  label: string;
  description?: string;
  status?: "ok" | "input_fault" | "output_fault" | "both_fault";
  input?: number;
  output?: number;
  updatedAt?: string;
};

type Termo24MapProps = {
  center?: Termo24MapPoint | null;
  points?: Termo24MapPoint[];
  className?: string;
  selectionMode?: boolean;
  showLocateControl?: boolean;
  showFallbackPoint?: boolean;
  onSelectionChange?: (point: LocatedPoint) => void;
  onSelectionClear?: () => void;
};

type MapCenterSyncProps = {
  center: [number, number];
};

type LocatedPoint = {
  lat: number;
  lng: number;
};

type MapInteractionProps = {
  selectionMode: boolean;
  showLocateControl: boolean;
  showDeleteControl: boolean;
  resetCenter: [number, number];
  onLocationFound: (point: LocatedPoint) => void;
  onLocationError: (message: string) => void;
  onLocateRequested: () => void;
  onDeleteRequested: () => void;
  onSelectionChange?: (point: LocatedPoint) => void;
  onSelectionClear?: () => void;
  onMapClick: (point: LocatedPoint) => void;
};

const selectedPinIcon = divIcon({
  className: "",
  html: `
    <div style="position:relative;width:24px;height:32px;display:flex;align-items:flex-start;justify-content:center;">
      <div style="width:20px;height:20px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#2563eb;border:2px solid #ffffff;box-shadow:0 8px 20px rgba(37,99,235,0.35);"></div>
      <div style="position:absolute;top:7px;width:7px;height:7px;border-radius:9999px;background:#ffffff;"></div>
    </div>
  `,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
});

const formatDateTime = (value?: string) => {
  if (!value) return "—";

  const parsedValue = parseISO(value);
  if (Number.isNaN(parsedValue.getTime())) return value;

  return format(parsedValue, "HH:mm:ss dd.MM.yyyy");
};

const statusLabelMap: Record<NonNullable<Termo24MapPoint["status"]>, string> = {
  ok: "OK",
  input_fault: "Input fault",
  output_fault: "Output fault",
  both_fault: "Both fault",
};

const MapCenterSync = ({ center }: MapCenterSyncProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false });
  }, [center, map]);

  return null;
};

const MapInteraction = ({
  selectionMode,
  showLocateControl,
  showDeleteControl,
  resetCenter,
  onLocationFound,
  onLocationError,
  onLocateRequested,
  onDeleteRequested,
  onSelectionChange,
  onSelectionClear,
  onMapClick,
}: MapInteractionProps) => {
  const map = useMap();

  useMapEvents({
    mouseover() {
      map.scrollWheelZoom.enable();
    },
    mouseout() {
      map.scrollWheelZoom.disable();
    },
    click(event) {
      if (!selectionMode) return;

      const selectedPoint = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      onMapClick(selectedPoint);
      onSelectionChange?.(selectedPoint);
    },
    locationfound(event) {
      const locatedPoint = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      onLocationFound(locatedPoint);
      onSelectionChange?.(locatedPoint);
      map.flyTo(event.latlng, Math.max(map.getZoom(), 15), {
        animate: true,
      });
    },
    locationerror(event) {
      onLocationError(event.message || "Joylashuvni aniqlab bo'lmadi");
    },
  });

  return (
    <>
      {showLocateControl ? (
        <div className="pointer-events-none absolute right-4 top-4 z-[1000] flex flex-col items-end gap-2">
          <button
            type="button"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur hover:bg-accent"
            onClick={() => {
              onLocateRequested();
              map.locate({
                setView: false,
                enableHighAccuracy: true,
                maxZoom: 16,
              });
            }}
            aria-label="Mening joylashuvim"
            title="Mening joylashuvim"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
          {showDeleteControl ? (
            <button
              type="button"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur hover:bg-accent"
              onClick={() => {
                onDeleteRequested();
                onSelectionClear?.();
                map.flyTo(resetCenter, map.getZoom(), { animate: true });
              }}
              aria-label="Tanlangan joyni o'chirish"
              title="Tanlangan joyni o'chirish"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}

      <img
        src="/yndex_logo_en.svg"
        alt="Yandex"
        className="pointer-events-none absolute bottom-4 left-4 z-[1000] h-10 w-auto select-none"
        draggable={false}
      />
    </>
  );
};

const Termo24Map = ({
  center,
  points = [],
  className,
  selectionMode = false,
  showLocateControl = false,
  showFallbackPoint = false,
  onSelectionChange,
  onSelectionClear,
}: Termo24MapProps) => {
  const resolvedCenter = center ?? {
    lat: 37.2242,
    lng: 67.2788,
    label: "Termiz shahri",
  };
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LocatedPoint | null>(null);

  useEffect(() => {
    if (!selectionMode) {
      setSelectedPoint(null);
      return;
    }

    setSelectedPoint({
      lat: resolvedCenter.lat,
      lng: resolvedCenter.lng,
    });
  }, [resolvedCenter.lat, resolvedCenter.lng, selectionMode]);

  const visiblePoints =
    !selectionMode && points.length > 0
      ? points
      : !selectionMode && showFallbackPoint
        ? [
            {
              lat: resolvedCenter.lat,
              lng: resolvedCenter.lng,
              label: resolvedCenter.label,
            },
          ]
        : [];

  return (
    <div className={cn("relative", className)}>
      <MapContainer
        center={[resolvedCenter.lat, resolvedCenter.lng]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full overflow-hidden rounded-xl"
      >
        <MapCenterSync center={[resolvedCenter.lat, resolvedCenter.lng]} />
        <MapInteraction
          selectionMode={selectionMode}
          showLocateControl={showLocateControl}
          showDeleteControl={selectionMode}
          resetCenter={[resolvedCenter.lat, resolvedCenter.lng]}
          onSelectionChange={onSelectionChange}
          onSelectionClear={onSelectionClear}
          onLocationFound={(point) => {
            setLocationStatus("ready");
            setLocationError(null);
            if (selectionMode) {
              setSelectedPoint(point);
            }
          }}
          onLocationError={(message) => {
            setLocationStatus("error");
            setLocationError(message);
          }}
          onLocateRequested={() => {
            setLocationStatus("loading");
            setLocationError(null);
          }}
          onDeleteRequested={() => {
            setSelectedPoint(null);
            setLocationStatus("idle");
            setLocationError(null);
          }}
          onMapClick={(point) => {
            setSelectedPoint(point);
            setLocationStatus("idle");
            setLocationError(null);
          }}
        />
        <TileLayer url={YANDEX_TILES_URL} />

        {visiblePoints.map((point) => (
          <CircleMarker
            key={`${point.lat}-${point.lng}-${point.label}`}
            center={[point.lat, point.lng]}
            radius={9}
            pathOptions={{
              color: "#0f766e",
              fillColor: "#14b8a6",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[16rem] space-y-3">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{point.label}</p>
                  {point.description ? (
                    <p className="text-xs text-muted-foreground">
                      {point.description}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border bg-muted/30 px-2 py-1.5">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground">
                      {point.status ? statusLabelMap[point.status] : "—"}
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/30 px-2 py-1.5">
                    <p className="text-muted-foreground">Yangilanish</p>
                    <p className="font-medium text-foreground">
                      {formatDateTime(point.updatedAt)}
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/30 px-2 py-1.5">
                    <p className="text-muted-foreground">Input</p>
                    <p className="font-medium text-foreground">
                      {typeof point.input === "number"
                        ? `${point.input.toFixed(2)}°C`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/30 px-2 py-1.5">
                    <p className="text-muted-foreground">Output</p>
                    <p className="font-medium text-foreground">
                      {typeof point.output === "number"
                        ? `${point.output.toFixed(2)}°C`
                        : "—"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {selectionMode && selectedPoint ? (
          <Marker
            position={[selectedPoint.lat, selectedPoint.lng]}
            icon={selectedPinIcon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Tanlangan joy</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ) : null}
      </MapContainer>

      {selectionMode ? (
        <div className="pointer-events-none absolute left-4 top-4 z-[1000] max-w-[18rem] space-y-2">
          {locationStatus === "loading" ? (
            <div className="rounded-lg border bg-background/95 px-3 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur">
              Joylashuv aniqlanmoqda...
            </div>
          ) : null}
          {locationStatus === "error" && locationError ? (
            <div className="rounded-lg border border-destructive/30 bg-background/95 px-3 py-2 text-xs text-destructive shadow-lg backdrop-blur">
              {locationError}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Termo24Map;
