import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Cpu, WifiOff, ThermometerSnowflake, CalendarPlus } from "lucide-react";

import { differenceInMinutes, parseISO } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import MapSection from "./MapSection";
import DevicesSection from "./DevicesSection";
import { useTermo24Devices } from "../../../../lib/api/termo24";

type Termo24Section = "dashboard" | "map" | "devices";

const resolveSection = (pathname: string): Termo24Section => {
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (normalizedPath.endsWith("/map")) {
    return "map";
  }

  if (normalizedPath.endsWith("/devices")) {
    return "devices";
  }

  return "dashboard";
};

const isStaleUpdate = (timestamp?: string) => {
  if (!timestamp) return false;

  const parsedValue = parseISO(timestamp);
  if (Number.isNaN(parsedValue.getTime())) return false;

  return differenceInMinutes(new Date(), parsedValue) > 30;
};

const Termo24ModulePage = () => {
  const location = useLocation();
  const section = resolveSection(location.pathname);
  const { data: allDevices } = useTermo24Devices();

  const { sectionTitle, sectionSubtitle } = useMemo(() => {
    switch (section) {
      case "map":
        return {
          sectionTitle: "Xarita",
          sectionSubtitle: "Tizim xaritasi",
        };
      case "devices":
        return {
          sectionTitle: "Qurilmalar",
          sectionSubtitle: "Tizim qurilmalari va ularning holati",
        };
      default:
        return {
          sectionTitle: "Hokimiyat Dashboard",
          sectionSubtitle: "Tizimni boshqarish va sozlash",
        };
    }
  }, [section]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{sectionTitle}</h1>
        <p className="text-muted-foreground">{sectionSubtitle}</p>
      </div>

      {section === "dashboard" && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* All Devices */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Barcha qurilmalar
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {allDevices?.length || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <Cpu className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inactive Devices */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Nofaol qurilmalar
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {allDevices?.filter(
                        ({ status, timestamp }) =>
                          status !== "ok" || isStaleUpdate(timestamp),
                      ).length || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                    <WifiOff className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lowest Temperature */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Eng past harorat
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {allDevices?.reduce((min, device) => {
                        return !min
                          ? String(device.input)
                          : Math.min(Number(min), device.input);
                      }, "") || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-cyan-100 p-3 text-cyan-600">
                    <ThermometerSnowflake className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installed This Month */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Shu oyda o'rnatilgan
                    </p>
                    <p className="mt-1 text-3xl font-bold text-foreground">
                      {allDevices?.filter(
                        (device) =>
                          new Date(device.createdAt) >=
                          new Date(new Date().setDate(1)),
                      ).length || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
                    <CalendarPlus className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tizim haqida qisqacha</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Termo24 tizimi, shahar hokimiyati va boshqa tashkilotlar uchun
                qurilmalarni boshqarish, monitoring qilish va ularning holatini
                kuzatish imkonini beruvchi platformadir. Ushbu tizim orqali
                foydalanuvchilar qurilmalarni xaritada ko'rish, ularning
                faoliyatini nazorat qilish va kerakli sozlamalarni amalga
                oshirish imkoniyatiga ega bo'lishadi.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {section === "map" && <MapSection />}

      {section === "devices" && <DevicesSection />}
    </div>
  );
};

export default Termo24ModulePage;
