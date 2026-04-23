import { Clock3 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getEcosystemEntryByPath } from "../config/menu";

const ComingSoonPage = () => {
  const location = useLocation();
  const activeEntry = getEcosystemEntryByPath(location.pathname);

  return (
    <div className="mx-auto flex max-w-5xl items-start">
      <Card className="w-full border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex rounded-full bg-amber-100 p-3 text-amber-600">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-3xl font-bold text-slate-900">Tez kunda...</CardTitle>
              <p className="mt-2 text-sm text-slate-500">
                {activeEntry?.label ?? "Ushbu bo'lim"} moduli uchun kontent tayyorlanmoqda.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            Bu bo'lim ekotizim menyusiga qo'shildi. Sahifa tuzilmasi va funksionali navbatma-navbat ishga tushiriladi.
          </p>
          <p>
            Hozircha ushbu modul uchun "Tez kunda..." holati ishlamoqda va keyingi bosqichda haqiqiy biznes komponentlar
            bilan to'ldiriladi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
