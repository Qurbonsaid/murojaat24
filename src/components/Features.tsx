import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  FileBarChart2,
  MapPinned,
  PhoneCall,
  Recycle,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    icon: PhoneCall,
    title: "Murojaat24",
    description:
      "Fuqarolardan kelib tushgan murojaatlarni qabul qilish, taqsimlash va yakunini kuzatish.",
    accent: "bg-[#0d4c8b]",
  },
  {
    icon: Recycle,
    title: "Toza hudud",
    description:
      "Hovli, ko'cha va mahalladagi tozalik muammolarini tezkor hal qilish uchun xizmat.",
    accent: "bg-emerald-600",
  },
  {
    icon: Building2,
    title: "Hudud va mahalla",
    description:
      "Mahalla, tuman va sektorlar kesimida hudud holatini kuzatish va boshqarish.",
    accent: "bg-sky-700",
  },
  {
    icon: ShieldCheck,
    title: "Nazorat 24",
    description:
      "Shahar xavfsizligi va jamoat tartibini nazorat qilish tizimi.",
    accent: "bg-indigo-700",
  },
  {
    icon: MapPinned,
    title: "Shahar passporti",
    description:
      "Termiz shahri infratuzilmasi va obyektlari haqida yagona ma'lumot bazasi.",
    accent: "bg-amber-600",
  },
  {
    icon: FileBarChart2,
    title: "Hisobotlar",
    description:
      "Kunlik, oylik va yillik hisobotlar orqali shahar xizmatlari samaradorligi.",
    accent: "bg-rose-600",
  },
];

const Features = () => {
  return (
    <section id="xizmatlar" className="bg-slate-50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-[#0d4c8b]/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#0d4c8b]">
            Shahar xizmatlari
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Termiz fuqarolari uchun yagona raqamli darvoza
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Barcha asosiy shahar xizmatlariga bitta joydan kiring: murojaat
            yuboring, holatni kuzating va shahar hayotida ishtirok eting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group h-full border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-[#0d4c8b]/40 hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col gap-4 p-7">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${service.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
