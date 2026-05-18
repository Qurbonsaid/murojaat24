import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Building2,
  Clock3,
  FileBarChart2,
  MapPinned,
  PhoneCall,
  Recycle,
  Settings2,
  ShieldCheck,
  TextSearch,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ModuleEntry = {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  accent: string;
  available: boolean;
};

const modules: ModuleEntry[] = [
  {
    id: "hudud",
    label: "Hudud",
    description:
      "Shahar hududlari va obyektlari haqida umumiy ma'lumotlar moduli.",
    path: "/ecosystem/hudud",
    icon: Building2,
    accent: "bg-sky-600",
    available: false,
  },
  {
    id: "toza-hudud",
    label: "Toza hudud",
    description:
      "Tozalik muammolari va ularga javob berish jarayonini kuzatish.",
    path: "/ecosystem/toza-hudud",
    icon: Recycle,
    accent: "bg-emerald-600",
    available: false,
  },
  {
    id: "murojaat24",
    label: "Murojaat24",
    description:
      "Fuqarolardan kelgan murojaatlarni qabul qilish, taqsimlash va nazorat qilish.",
    path: "/ecosystem/murojaat24",
    icon: PhoneCall,
    accent: "bg-[#0d4c8b]",
    available: true,
  },
  {
    id: "kommunal-chaqiruvlar",
    label: "Kommunal chaqiruvlar",
    description:
      "Kommunal xizmatlar bo'yicha chaqiruvlar va ularning bajarilishi.",
    path: "/ecosystem/kommunal-chaqiruvlar",
    icon: TextSearch,
    accent: "bg-amber-600",
    available: false,
  },
  {
    id: "nazorat-24",
    label: "Nazorat 24",
    description: "Shahar xavfsizligi va jamoat tartibi nazorati.",
    path: "/ecosystem/nazorat-24",
    icon: ShieldCheck,
    accent: "bg-indigo-700",
    available: false,
  },
  {
    id: "shahar-passporti",
    label: "Shahar passporti",
    description:
      "Termiz shahri infratuzilmasi va obyektlari yagona ma'lumot bazasi.",
    path: "/ecosystem/shahar-passporti",
    icon: MapPinned,
    accent: "bg-rose-600",
    available: false,
  },
  {
    id: "hududlar-taqsimoti",
    label: "Hududlar taqsimoti",
    description:
      "Tumanlar, mahallalar va sektorlar kesimidagi taqsimot va statistika.",
    path: "/ecosystem/hududlar-taqsimoti",
    icon: MapPinned,
    accent: "bg-purple-600",
    available: false,
  },
  {
    id: "hisobotlar",
    label: "Hisobotlar",
    description:
      "Kunlik, oylik va yillik hisobotlarni yuritish va eksport qilish.",
    path: "/ecosystem/hisobotlar",
    icon: FileBarChart2,
    accent: "bg-teal-600",
    available: false,
  },
  {
    id: "sozlamalar",
    label: "Sozlamalar",
    description:
      "Ekotizim uchun umumiy sozlamalar: tashkilotlar, shablonlar va boshqalar.",
    path: "/ecosystem/sozlamalar",
    icon: Settings2,
    accent: "bg-slate-700",
    available: true,
  },
];

const ModullarPage = () => {
  const availableCount = modules.filter((module) => module.available).length;
  const comingSoonCount = modules.length - availableCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Modullar</h1>
        <p className="mt-1 text-muted-foreground">
          Termiz aqlli shahar ekotizimining barcha modullari bir joyda. Faol
          modulga kiring yoki kelgusidagi modullar bilan tanishing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Faol modullar: {availableCount}
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Tez kunda: {comingSoonCount}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.id}
              className="group relative overflow-hidden border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-[#0d4c8b]/40 hover:shadow-md"
            >
              {!module.available && (
                <Badge className="absolute right-3 top-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <Clock3 className="mr-1 h-3 w-3" />
                  Tez kunda
                </Badge>
              )}
              {module.available && (
                <Badge className="absolute right-3 top-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Faol
                </Badge>
              )}

              <CardContent className="flex h-full flex-col gap-4 p-6">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${module.accent}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {module.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {module.description}
                  </p>
                </div>

                <div className="mt-auto pt-2">
                  {module.available ? (
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#0d4c8b] text-white hover:bg-[#0a3d70]"
                    >
                      <Link to={module.path}>
                        Modulga kirish
                        <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="border-slate-200 text-slate-400"
                    >
                      Mavjud emas
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModullarPage;
