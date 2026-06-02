import type { LucideIcon } from "lucide-react";
import {
  FileBarChart2,
  LayoutGrid,
  MapPinned,
  PhoneCall,
  Recycle,
  Settings2,
  ShieldCheck,
  TextSearch,
} from "lucide-react";

export type EcosystemModuleKind =
  | "modullar"
  | "murojaat24"
  | "sozlamalar"
  | "coming-soon";

export type EcosystemMenuChild = {
  id: string;
  label: string;
  path: string;
  moduleKind: EcosystemModuleKind;
};

export type EcosystemMenuItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  moduleKind: EcosystemModuleKind;
  children?: EcosystemMenuChild[];
};

export type EcosystemRouteEntry = {
  id: string;
  label: string;
  path: string;
  routePath: string;
  moduleKind: EcosystemModuleKind;
  parentId?: string;
};

export const isEcosystemMenuComingSoon = (moduleKind: EcosystemModuleKind) =>
  moduleKind === "coming-soon";

/** Sidebar entries only — excludes `coming-soon` parents and children. */
export const getVisibleEcosystemMenuItems = (): EcosystemMenuItem[] =>
  ecosystemMenuItems
    .filter((item) => !isEcosystemMenuComingSoon(item.moduleKind))
    .map((item) => {
      if (!item.children?.length) {
        return item;
      }

      return {
        ...item,
        children: item.children.filter(
          (child) => !isEcosystemMenuComingSoon(child.moduleKind)
        ),
      };
    });

export const ecosystemMenuItems: EcosystemMenuItem[] = [
  {
    id: "modullar",
    label: "Modullar",
    path: "/ecosystem/modules",
    icon: LayoutGrid,
    moduleKind: "modullar",
  },
  {
    id: "murojaat24",
    label: "Murojaat24",
    path: "/ecosystem/murojaat24",
    icon: PhoneCall,
    moduleKind: "murojaat24",
    children: [
      {
        id: "murojaatlar",
        label: "Murojaatlar",
        path: "/ecosystem/murojaat24/appeals",
        moduleKind: "murojaat24",
      },
      {
        id: "statistika",
        label: "Statistika",
        path: "/ecosystem/murojaat24/statistics",
        moduleKind: "murojaat24",
      },
      {
        id: "foydalanuvchilar",
        label: "Foydalanuvchilar",
        path: "/ecosystem/murojaat24/users",
        moduleKind: "murojaat24",
      },
    ],
  },

  {
    id: "toza-hudud",
    label: "Toza hudud",
    path: "/ecosystem/clean-territory",
    icon: Recycle,
    moduleKind: "coming-soon",
  },
  {
    id: "kommunal-chaqiruvlar",
    label: "Kommunal chaqiruvlar",
    path: "/ecosystem/utility-calls",
    icon: TextSearch,
    moduleKind: "coming-soon",
  },
  {
    id: "nazorat-24",
    label: "Nazorat 24",
    path: "/ecosystem/supervision-24",
    icon: ShieldCheck,
    moduleKind: "coming-soon",
  },
  {
    id: "shahar-passporti",
    label: "Shahar Passporti",
    path: "/ecosystem/city-passport",
    icon: MapPinned,
    moduleKind: "coming-soon",
  },
  {
    id: "hududlar-taqsimoti",
    label: "Hududlar taqsimoti",
    path: "/ecosystem/territory-distribution",
    icon: MapPinned,
    moduleKind: "coming-soon",
    children: [
      {
        id: "mahallalar-kesimida",
        label: "Mahallalar kesimida",
        path: "/ecosystem/territory-distribution/by-neighborhoods",
        moduleKind: "coming-soon",
      },
      {
        id: "sektorlar-kesimida",
        label: "Sektorlar kesimida",
        path: "/ecosystem/territory-distribution/by-sectors",
        moduleKind: "coming-soon",
      },
    ],
  },
  {
    id: "hisobotlar",
    label: "Hisobotlar",
    path: "/ecosystem/reports",
    icon: FileBarChart2,
    moduleKind: "coming-soon",
    children: [
      {
        id: "kunlik-hisobot",
        label: "Kunlik hisobot",
        path: "/ecosystem/reports/daily",
        moduleKind: "coming-soon",
      },
      {
        id: "oylik-hisobot",
        label: "Oylik hisobot",
        path: "/ecosystem/reports/monthly",
        moduleKind: "coming-soon",
      },
      {
        id: "yillik-hisobot",
        label: "Yillik hisobot",
        path: "/ecosystem/reports/annual",
        moduleKind: "coming-soon",
      },
    ],
  },
  {
    id: "sozlamalar",
    label: "Sozlamalar",
    path: "/ecosystem/settings",
    icon: Settings2,
    moduleKind: "sozlamalar",
    children: [
      {
        id: "rahbariyat",
        label: "Rahbariyat",
        path: "/ecosystem/settings/leadership",
        moduleKind: "sozlamalar",
      },
      {
        id: "tashkilotlar",
        label: "Tashkilotlar",
        path: "/ecosystem/settings/organizations",
        moduleKind: "sozlamalar",
      },
      {
        id: "obyekt-turi",
        label: "Obyekt turi",
        path: "/ecosystem/settings/object-types",
        moduleKind: "coming-soon",
      },
      {
        id: "chaqiruv-turi",
        label: "Chaqiruv turi",
        path: "/ecosystem/settings/call-types",
        moduleKind: "coming-soon",
      },
      {
        id: "ish-vaqtlari",
        label: "Ish vaqtlari",
        path: "/ecosystem/settings/work-hours",
        moduleKind: "coming-soon",
      },
      {
        id: "shablonlar",
        label: "Bildirishnoma shablonlari",
        path: "/ecosystem/settings/templates",
        moduleKind: "coming-soon",
      },
      {
        id: "umumiy",
        label: "Umumiy sozlamalar",
        path: "/ecosystem/settings/general",
        moduleKind: "coming-soon",
      },
    ],
  },
];

const toRoutePath = (path: string) => path.replace(/^\/ecosystem\/?/, "");

export const ecosystemRouteEntries: EcosystemRouteEntry[] =
  ecosystemMenuItems.flatMap((item) => {
    const current: EcosystemRouteEntry = {
      id: item.id,
      label: item.label,
      path: item.path,
      routePath: toRoutePath(item.path),
      moduleKind: item.moduleKind,
    };

    const childEntries: EcosystemRouteEntry[] =
      item.children?.map((child) => ({
        id: `${item.id}-${child.id}`,
        label: child.label,
        path: child.path,
        routePath: toRoutePath(child.path),
        moduleKind: child.moduleKind,
        parentId: item.id,
      })) ?? [];

    return [current, ...childEntries];
  });

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
};

export const getEcosystemEntryByPath = (pathname: string) => {
  const normalizedPath = normalizePath(pathname);
  return ecosystemRouteEntries.find(
    (entry) => normalizePath(entry.path) === normalizedPath
  );
};
