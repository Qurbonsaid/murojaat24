import type { LucideIcon } from "lucide-react";
import {
  FileBarChart2,
  PhoneCall,
  Recycle,
  ThermometerSun,
  Trees,
  Users,
  Zap,
} from "lucide-react";

export type ModuleEntry = {
  id: string;
  label: string;
  brief: string;
  problem: string;
  solution: string;
  path: string;
  icon: LucideIcon;
  accent: string;
  available: boolean;
};

export const ecosystemModules: ModuleEntry[] = [
  {
    id: "murojaatlar",
    label: "Murojaatlar",
    brief:
      "Fuqarolardan tushayotgan barcha murojaatlarni yagona markazlashgan tizim orqali qabul qilish, taqsimlash va ijrosini nazorat qilish moduli.",
    problem:
      "Fuqarolardan turli norasmiy kanallar orqali tarqoq va nazoratsiz murojaatlar keladi. Yagona qabul, yo‘naltirish va ijro nazorati tizimi mavjud emas.",
    solution:
      "Operator paneli, fuqarolar uchun Telegram-bot va moslashtirilgan Android/iOS mobil ilovalari orqali yagona markazlashgan qabul tizimi.",
    path: "/ecosystem/murojaat24",
    icon: PhoneCall,
    accent: "bg-[#0d4c8b]",
    available: true,
  },
  {
    id: "topshiriqlar-va-hisobotlar",
    label: "Topshiriqlar va hisobotlar",
    brief:
      "Hokimiyat ichki topshiriqlari ijro intizomi, KPI ko‘rsatkichlari va tahliliy hisobotlarni yuritish moduli.",
    problem:
      "Hokimiyat ichidagi ichki topshiriqlar va buyruqlar qog‘ozda yoki alohida messenjerlarda tarqoq yuritiladi. Yagona tahliliy hisobot tizimi mavjud emas.",
    solution:
      "Ijro intizomi va KPI reytingini avtomatik hisoblovchi, kechikkan topshiriqlarni qizil indikator bilan eskalatsiya qiluvchi tizim.",
    path: "/ecosystem/reports",
    icon: FileBarChart2,
    accent: "bg-teal-600",
    available: false,
  },
  {
    id: "kommunal-xizmatlar",
    label: "Kommunal xizmatlar",
    brief:
      "Gaz, elektr va suv ta'minoti billing ma'lumotlari hamda mahallalar kesimidagi qarzdorlik tahlili dashboardi.",
    problem:
      "Gaz, elektr va suv bo‘yicha billing ma’lumotlari hududiy idoralarda tarqoq holatda bo‘lib, mahalla kesimida yagona tahlil qilish imkoni yo‘q.",
    solution:
      "Idoralararo integratsiya platformasi (МИП - egov.uz) shlyuzi orqali Termiz shahri mahallalari kesimida qarzdorlikning yagona tahliliy dashboardini yaratish.",
    path: "/ecosystem/utility-calls",
    icon: Zap,
    accent: "bg-amber-600",
    available: false,
  },
  {
    id: "issiqlik-taminoti",
    label: "Issiqlik ta'minoti",
    brief:
      "Qozonxonalar holati va harorat parametrlarini 24/7 rejimida sensorli datchiklar orqali onlayn monitoring qilish tizimi.",
    problem:
      "Qozonxonalarda (katyolnilarda) harorat va avariya holatlari qo‘lda yoki kechikib tekshiriladi, sensorli datchiklar markazlashmagan.",
    solution:
      "ESP32 mikrokontrolleri + Termostat hamda Sim-kartali Wi-Fi routerlar orqali real vaqt rejimida (24/7) issiqlik monitoringi va threshold alert tizimi.",
    path: "/ecosystem/termo24",
    icon: ThermometerSun,
    accent: "bg-rose-600",
    available: true,
  },
  {
    id: "chiqindi-boshqaruvi",
    label: "Chiqindi boshqaruvi",
    brief:
      "Maxsus texnikalar harakati va chiqindi to‘planish nuqtalarini sun'iy intellekt (AI) hamda GPS orqali nazorat qilish.",
    problem:
      "Mashinalar harakati va chiqindi idishlarining holati to‘liq nazorat qilinmaydi, fotohisobot va marshrut nazorati parchalanib ketgan.",
    solution:
      "Mashinalardagi amaldagi GPS treklerlar integratsiyasi hamda chiqindi nuqtalaridagi kameralar tasvirini Sun'iy Intellekt (AI) orqali tahlil qilib, to‘lganlikni aniqlash tizimi.",
    path: "/ecosystem/clean-territory",
    icon: Recycle,
    accent: "bg-emerald-600",
    available: false,
  },
  {
    id: "obodonlashtirish",
    label: "Obodonlashtirish",
    brief:
      'Smart sug‘orish tizimi hamda "Yashil makon" umummilliy loyihasi daraxtlarining koordinatali georeyestri.',
    problem:
      "Yashil hududlarni sug‘orish va daraxtlar hisobi tizimsiz yoki qo‘lda yuritiladi, raqamli monitoring hamda sensorlar cheklangan.",
    solution:
      'ESP32 va Rele (Relay) modullari yordamida smart sug‘orish hamda "Yashil makon" daraxtlarining foto-dalillar va koordinatali georeyestri.',
    path: "/ecosystem/landscaping",
    icon: Trees,
    accent: "bg-green-700",
    available: false,
  },
  {
    id: "ijtimoiy-soha",
    label: "Ijtimoiy soha",
    brief:
      "Mahalla yettiligi va mas'ul xodimlar faoliyatini koordinatsiya qilish hamda geolokatsiyali ish hisoboti tizimi.",
    problem:
      "Mahalla yettiligi va mas'ul xodimlarning joylardagi real faoliyatini, xodimlar harakati va xizmat sifatini kuzatish imkoniyati past.",
    solution:
      "МИП API orqali mahallalar reyestrini yuklash hamda xodimlarning Android/iOS planshet/mobil ilovasi orqali geolokatsiyali ish hisoboti.",
    path: "/ecosystem/social-sphere",
    icon: Users,
    accent: "bg-indigo-600",
    available: false,
  },
];

export const getEcosystemModuleByPath = (
  pathname: string
): ModuleEntry | undefined => {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return ecosystemModules.find(
    (m) => m.path === normalized || normalized.startsWith(`${m.path}/`)
  );
};
