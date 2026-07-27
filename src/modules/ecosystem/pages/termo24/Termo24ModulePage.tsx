import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Clock, FileText, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import MapSection from "./MapSection";
import DevicesSection from "./DevicesSection";

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

const Termo24ModulePage = () => {
  const location = useLocation();
  const section = resolveSection(location.pathname);

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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Faol qurilmalar
                    </p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Nofaol qurilmalar
                    </p>
                    <p className="text-3xl font-bold text-foreground">3</p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Jami qurilmalar
                    </p>
                    <p className="text-3xl font-bold text-foreground">15</p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Shu oyda o'rnatilgan
                    </p>
                    <p className="mt-1 text-3xl font-bold text-foreground">5</p>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
                    <Clock className="h-6 w-6" />
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
