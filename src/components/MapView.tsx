import { MapPin, Navigation } from "lucide-react";

import { cn } from "@/lib/utils";

interface MapViewProps {
  compact?: boolean;
}

const MapView = ({ compact = false }: MapViewProps) => {
  // Mock marker positions (percentage-based for responsive positioning)
  const markers = {
    new: [
      { id: 1, x: 25, y: 30 },
      { id: 2, x: 45, y: 45 },
      { id: 3, x: 60, y: 25 },
      { id: 4, x: 70, y: 60 },
      { id: 5, x: 35, y: 70 },
      { id: 6, x: 80, y: 35 },
    ],
    inProgress: [
      { id: 7, x: 40, y: 55 },
      { id: 8, x: 55, y: 40 },
      { id: 9, x: 75, y: 50 },
    ],
    completed: [
      { id: 10, x: 30, y: 40 },
      { id: 11, x: 50, y: 30 },
      { id: 12, x: 65, y: 45 },
      { id: 13, x: 45, y: 65 },
      { id: 14, x: 70, y: 70 },
      { id: 15, x: 25, y: 55 },
      { id: 16, x: 85, y: 45 },
      { id: 17, x: 55, y: 75 },
    ],
    specialists: [
      { id: 18, x: 35, y: 35 },
      { id: 19, x: 60, y: 50 },
      { id: 20, x: 50, y: 60 },
      { id: 21, x: 75, y: 40 },
    ],
  };

  return (
    <div className={cn(compact ? "space-y-3" : "space-y-4")}>
      <div
        className={cn(
          "relative w-full rounded-lg overflow-hidden border border-border bg-slate-100",
          compact ? "h-[calc(100vh-360px)] min-h-[300px]" : "h-[500px]",
        )}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* New requests - Red markers */}
        {markers.new.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div className="relative group">
              <MapPin
                className="h-7 w-7 text-red-500 drop-shadow-lg cursor-pointer hover:scale-110 transition-transform"
                fill="currentColor"
              />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Yangi murojaat
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* In progress - Yellow markers */}
        {markers.inProgress.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div className="relative group">
              <MapPin
                className="h-7 w-7 text-yellow-500 drop-shadow-lg cursor-pointer hover:scale-110 transition-transform"
                fill="currentColor"
              />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Jarayonda
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Completed - Green markers */}
        {markers.completed.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div className="relative group">
              <MapPin
                className="h-6 w-6 text-green-500 drop-shadow-lg cursor-pointer hover:scale-110 transition-transform"
                fill="currentColor"
              />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Bajarilgan
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Specialists - Blue markers */}
        {markers.specialists.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div className="relative group">
              <Navigation
                className="h-6 w-6 text-blue-500 drop-shadow-lg cursor-pointer hover:scale-110 transition-transform"
                fill="currentColor"
              />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Mutaxassis
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className={cn(
          "flex items-center justify-center flex-wrap",
          compact ? "gap-4" : "gap-6",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-muted-foreground">Yangi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-muted-foreground">Jarayonda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Bajarilgan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-muted-foreground">Mutaxassislar</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
