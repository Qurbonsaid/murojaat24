import {
  ArrowRight,
  BarChart3,
  Building2,
  LayoutTemplate,
  ListChecks,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Send,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type QuickAction = {
  label: string;
  description: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

const citizenFlowActions: QuickAction[] = [
  {
    label: "Murojaat yuborish",
    description: "Fuqaro nomidan yangi murojaat yaratish.",
    path: "/murojaat-yuborish",
    icon: Send,
  },
  {
    label: "Murojaatni kuzatish",
    description: "Murojaat holatini raqam bo'yicha tekshirish.",
    path: "/kuzatish",
    icon: ListChecks,
  },
];

const operationsActions: QuickAction[] = [
  {
    label: "Operator paneli",
    description: "Chaqiruvlarni qabul qilish va ro'yxatga olish.",
    path: "/operator-dashboard",
    icon: PhoneCall,
  },
  {
    label: "Dispatcher paneli",
    description: "Topshiriqlarni mutaxassislarga taqsimlash.",
    path: "/dispatcher-dashboard",
    icon: MapPinned,
  },
  {
    label: "Mutaxassis mobil",
    description: "Joyida bajarilayotgan ishlarni boshqarish.",
    path: "/specialist-mobile",
    icon: Building2,
  },
];

const managementActions: QuickAction[] = [
  {
    label: "Statistika",
    description: "KPI va bajarilish ko'rsatkichlarini tahlil qilish.",
    path: "/statistika",
    icon: BarChart3,
  },
  {
    label: "Menjer paneli",
    description: "Bajarilgan ishlarni tekshirish va tasdiqlash.",
    path: "/manager-dashboard",
    icon: ListChecks,
  },
  {
    label: "Hokimiyat paneli",
    description: "Tizim foydalanuvchilari va sozlamalarni boshqarish.",
    path: "/admin-dashboard",
    icon: ShieldCheck,
  },
];

const ActionGrid = ({ actions }: { actions: QuickAction[] }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {actions.map((action) => {
      const Icon = action.icon;

      return (
        <Card key={action.path} className="border-[#cddcf4] bg-white shadow-sm">
          <CardContent className="flex h-full flex-col gap-3 p-5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7effd] text-[#0f5da5]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{action.label}</h3>
              <p className="mt-1 text-sm text-slate-600">{action.description}</p>
            </div>
            <div className="mt-auto">
              <Button asChild variant="outline" className="w-full border-[#c2d8fb] text-[#0f4b87] hover:bg-[#edf4ff]">
                <Link to={action.path}>
                  Ochish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

const Murojaat24ModulePage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Card className="border border-[#cddcf4] bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e7effd] px-3 py-1 text-xs font-semibold text-[#0f5da5]">
            <LayoutTemplate className="h-4 w-4" />
            Ekotizim moduli
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Murojaat24</CardTitle>
          <CardDescription className="text-slate-600">
            Ichki menyu chap panel o'rniga yuqori qismga ko'chirildi va vazifa bo'yicha guruhlandi.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm text-slate-600">
            Shu dizayn orqali foydalanuvchi birinchi navbatda modul ichidagi asosiy yo'nalishni tanlaydi, keyin kerakli
            bo'limga o'tadi. Bu ikki xil yon menyu bir vaqtning o'zida ko'rinishini kamaytiradi.
          </p>

          <Tabs defaultValue="citizen" className="space-y-4">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-[#eef4ff] p-2">
              <TabsTrigger value="citizen">Fuqaro oqimi</TabsTrigger>
              <TabsTrigger value="operations">Operatsion</TabsTrigger>
              <TabsTrigger value="management">Boshqaruv</TabsTrigger>
            </TabsList>

            <TabsContent value="citizen">
              <ActionGrid actions={citizenFlowActions} />
            </TabsContent>

            <TabsContent value="operations">
              <ActionGrid actions={operationsActions} />
            </TabsContent>

            <TabsContent value="management">
              <ActionGrid actions={managementActions} />
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" className="bg-[#0d5c9f] hover:bg-[#0a4d85]">
              <Link to="/login">
                Murojaat24 ga kirish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Murojaat24ModulePage;
