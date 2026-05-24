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
    path: "/ecosystem/modullar",
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
        path: "/ecosystem/murojaat24/murojaatlar",
        moduleKind: "murojaat24",
      },
      {
        id: "statistika",
        label: "Statistika",
        path: "/ecosystem/murojaat24/statistika",
        moduleKind: "murojaat24",
      },
      {
        id: "foydalanuvchilar",
        label: "Foydalanuvchilar",
        path: "/ecosystem/murojaat24/foydalanuvchilar",
        moduleKind: "murojaat24",
      },
    ],
  },

  {
    id: "toza-hudud",
    label: "Toza hudud",
    path: "/ecosystem/toza-hudud",
    icon: Recycle,
    moduleKind: "coming-soon",
  },
  {
    id: "kommunal-chaqiruvlar",
    label: "Kommunal chaqiruvlar",
    path: "/ecosystem/kommunal-chaqiruvlar",
    icon: TextSearch,
    moduleKind: "coming-soon",
  },
  {
    id: "nazorat-24",
    label: "Nazorat 24",
    path: "/ecosystem/nazorat-24",
    icon: ShieldCheck,
    moduleKind: "coming-soon",
  },
  {
    id: "shahar-passporti",
    label: "Shahar Passporti",
    path: "/ecosystem/shahar-passporti",
    icon: MapPinned,
    moduleKind: "coming-soon",
  },
  {
    id: "hududlar-taqsimoti",
    label: "Hududlar taqsimoti",
    path: "/ecosystem/hududlar-taqsimoti",
    icon: MapPinned,
    moduleKind: "coming-soon",
    children: [
      {
        id: "mahallalar-kesimida",
        label: "Mahallalar kesimida",
        path: "/ecosystem/hududlar-taqsimoti/mahallalar-kesimida",
        moduleKind: "coming-soon",
      },
      {
        id: "sektorlar-kesimida",
        label: "Sektorlar kesimida",
        path: "/ecosystem/hududlar-taqsimoti/sektorlar-kesimida",
        moduleKind: "coming-soon",
      },
    ],
  },
  {
    id: "hisobotlar",
    label: "Hisobotlar",
    path: "/ecosystem/hisobotlar",
    icon: FileBarChart2,
    moduleKind: "coming-soon",
    children: [
      {
        id: "kunlik-hisobot",
        label: "Kunlik hisobot",
        path: "/ecosystem/hisobotlar/kunlik-hisobot",
        moduleKind: "coming-soon",
      },
      {
        id: "oylik-hisobot",
        label: "Oylik hisobot",
        path: "/ecosystem/hisobotlar/oylik-hisobot",
        moduleKind: "coming-soon",
      },
      {
        id: "yillik-hisobot",
        label: "Yillik hisobot",
        path: "/ecosystem/hisobotlar/yillik-hisobot",
        moduleKind: "coming-soon",
      },
    ],
  },
  {
    id: "sozlamalar",
    label: "Sozlamalar",
    path: "/ecosystem/sozlamalar",
    icon: Settings2,
    moduleKind: "sozlamalar",
    children: [
      {
        id: "rahbariyat",
        label: "Rahbariyat",
        path: "/ecosystem/sozlamalar/rahbariyat",
        moduleKind: "sozlamalar",
      },
      {
        id: "tashkilotlar",
        label: "Tashkilotlar",
        path: "/ecosystem/sozlamalar/tashkilotlar",
        moduleKind: "sozlamalar",
      },
      {
        id: "obyekt-turi",
        label: "Obyekt turi",
        path: "/ecosystem/sozlamalar/obyekt-turi",
        moduleKind: "coming-soon",
      },
      {
        id: "chaqiruv-turi",
        label: "Chaqiruv turi",
        path: "/ecosystem/sozlamalar/chaqiruv-turi",
        moduleKind: "coming-soon",
      },
      {
        id: "ish-vaqtlari",
        label: "Ish vaqtlari",
        path: "/ecosystem/sozlamalar/ish-vaqtlari",
        moduleKind: "coming-soon",
      },
      {
        id: "shablonlar",
        label: "Bildirishnoma shablonlari",
        path: "/ecosystem/sozlamalar/shablonlar",
        moduleKind: "coming-soon",
      },
      {
        id: "umumiy",
        label: "Umumiy sozlamalar",
        path: "/ecosystem/sozlamalar/umumiy",
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
