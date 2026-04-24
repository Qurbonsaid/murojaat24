import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Clock3, Edit, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  getAllGovernanceCategories,
  getOrganizationsByGovernance,
  organizations,
} from "@/lib/organizations";

type SozlamalarSection =
  | "rahbariyat"
  | "tashkilotlar"
  | "obyekt-turi"
  | "chaqiruv-turi"
  | "ish-vaqtlari"
  | "shablonlar"
  | "umumiy"
  | "overview";

const sectionMeta: Record<
  SozlamalarSection,
  { title: string; subtitle: string }
> = {
  overview: {
    title: "Sozlamalar",
    subtitle: "Tizimning barcha sozlamalari bitta joyda birlashtirilgan.",
  },
  rahbariyat: {
    title: "Rahbariyat",
    subtitle: "Tashkilotlarning rahbariyat kesimidagi taqsimoti.",
  },
  tashkilotlar: {
    title: "Tashkilotlar",
    subtitle: "Ekotizimga ulangan tashkilotlar ro'yxati.",
  },
  "obyekt-turi": {
    title: "Obyekt turi",
    subtitle: "Murojaat obyektlari turlari sozlamalari.",
  },
  "chaqiruv-turi": {
    title: "Chaqiruv turi",
    subtitle: "Kommunal chaqiruv turlari sozlamalari.",
  },
  "ish-vaqtlari": {
    title: "Ish vaqtlari",
    subtitle: "Xizmatlar uchun ish vaqtlari jadvali.",
  },
  shablonlar: {
    title: "Bildirishnoma shablonlari",
    subtitle: "SMS va email xabarnomalar uchun shablonlar.",
  },
  umumiy: {
    title: "Umumiy sozlamalar",
    subtitle: "Tizim bo'ylab amal qiladigan umumiy sozlamalar.",
  },
};

const resolveSection = (pathname: string): SozlamalarSection => {
  const match = pathname.match(/\/ecosystem\/sozlamalar\/([^/]+)/);
  const slug = match?.[1];

  switch (slug) {
    case "rahbariyat":
    case "tashkilotlar":
    case "obyekt-turi":
    case "chaqiruv-turi":
    case "ish-vaqtlari":
    case "shablonlar":
    case "umumiy":
      return slug;
    default:
      return "overview";
  }
};

const smsTemplates = [
  {
    id: 1,
    name: "Qabul qilindi",
    content:
      "Hurmatli {name}, murojaatingiz qabul qilindi. Raqam: {number}",
  },
  {
    id: 2,
    name: "Tayinlandi",
    content: "Murojaatingiz {specialist}ga tayinlandi. Tel: {phone}",
  },
  {
    id: 3,
    name: "Bajarildi",
    content: "Murojaatingiz bajarildi. Fikr-mulohazalaringizni bildiring.",
  },
];

const ComingSoonCard = ({ sectionLabel }: { sectionLabel: string }) => (
  <Card>
    <CardHeader>
      <div className="flex items-start gap-4">
        <span className="mt-1 inline-flex rounded-full bg-amber-100 p-3 text-amber-600">
          <Clock3 className="h-5 w-5" />
        </span>
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Tez kunda...
          </CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            {sectionLabel} sozlamalari tayyorlanmoqda.
          </p>
        </div>
      </div>
    </CardHeader>
  </Card>
);

const RahbariyatSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Rahbariyat</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rahbariyat qidirish..." className="pl-10" />
      </div>
      <div className="max-h-[32rem] space-y-4 overflow-y-auto">
        {getAllGovernanceCategories().map((category) => {
          const orgs = getOrganizationsByGovernance(category);
          return (
            <div key={category} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold">{category}</h4>
                <Badge variant="secondary">{orgs.length} tashkilot</Badge>
              </div>
              <div className="space-y-2">
                {orgs.map((org, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-muted py-1 pl-4 text-sm text-muted-foreground"
                  >
                    {org}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const TashkilotlarSection = () => {
  const [searchOrg, setSearchOrg] = useState("");
  const filtered = useMemo(
    () =>
      organizations.filter((org) =>
        org.toLowerCase().includes(searchOrg.toLowerCase()),
      ),
    [searchOrg],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tashkilotlar</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Yangi tashkilot
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tashkilot qidirish..."
            className="pl-10"
            value={searchOrg}
            onChange={(event) => setSearchOrg(event.target.value)}
          />
        </div>
        <div className="max-h-[32rem] space-y-2 overflow-y-auto">
          {filtered.map((org, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="text-sm font-medium">{org}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ShablonlarSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Bildirishnoma shablonlari</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {smsTemplates.map((template) => (
        <div key={template.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <h4 className="font-semibold">{template.name}</h4>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{template.content}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const UmumiySection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Umumiy sozlamalar</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Email xabarnomalar</Label>
          <p className="text-sm text-muted-foreground">
            Fuqarolarga email yuborish
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>SMS xabarnomalar</Label>
          <p className="text-sm text-muted-foreground">
            Fuqarolarga SMS yuborish
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="space-y-2">
        <Label>Maksimal rasm hajmi (MB)</Label>
        <Input type="number" defaultValue="5" />
      </div>

      <div className="space-y-2">
        <Label>Javob kutish vaqti (daqiqa)</Label>
        <Input type="number" defaultValue="30" />
      </div>

      <Button>Saqlash</Button>
    </CardContent>
  </Card>
);

const OverviewSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sozlamalar bo'limlari</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      <p>
        Chap menyudan kerakli sozlamalar bo'limini tanlang. Murojaat24 va
        ekotizimning boshqa modullariga tegishli sozlamalar shu bitta bo'limda
        birlashtirilgan.
      </p>
    </CardContent>
  </Card>
);

const SozlamalarPage = () => {
  const location = useLocation();
  const section = resolveSection(location.pathname);
  const { title, subtitle } = sectionMeta[section];

  const renderSection = () => {
    switch (section) {
      case "rahbariyat":
        return <RahbariyatSection />;
      case "tashkilotlar":
        return <TashkilotlarSection />;
      case "shablonlar":
        return <ShablonlarSection />;
      case "umumiy":
        return <UmumiySection />;
      case "obyekt-turi":
        return <ComingSoonCard sectionLabel="Obyekt turi" />;
      case "chaqiruv-turi":
        return <ComingSoonCard sectionLabel="Chaqiruv turi" />;
      case "ish-vaqtlari":
        return <ComingSoonCard sectionLabel="Ish vaqtlari" />;
      case "overview":
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {renderSection()}
    </div>
  );
};

export default SozlamalarPage;
