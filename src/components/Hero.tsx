import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";

const bullets = [
  "Murojaatlarni 24/7 qabul qilish",
  "Ishonchli va shaffof ko'rib chiqish",
  "Har bir bosqich real vaqtda kuzatiladi",
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-[#0b3d72] via-[#0d4c8b] to-[#0f5ea8] text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(125,211,252,0.25), transparent 50%)",
        }}
      />

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-sky-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Termiz shahar hokimligi rasmiy platformasi
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Termiz aqlli shahar —
              <span className="block text-sky-200">
                fuqarolar uchun raqamli xizmatlar
              </span>
            </h1>

            <p className="max-w-xl text-base text-sky-100/90 md:text-lg">
              Murojaat yuboring, kommunal xizmatlarni kuzating, mahalla va
              shahar hayotidagi o'zgarishlarni bir joydan boshqaring. Termiz
              shahri fuqarolar uchun qulay va shaffof xizmatlarni yo'lga
              qo'ymoqda.
            </p>

            <ul className="space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-sm text-sky-50">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-sky-300" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white px-7 text-base font-semibold text-[#0d4c8b] shadow-lg hover:bg-sky-50"
              >
                <a href="#xizmatlar">
                  Murojaat qoldirish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#xizmatlar">Xizmatlarni ko'rish</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />
            <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-6 text-slate-800 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d4c8b] text-white">
                    <PhoneCall className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Ishonch telefoni
                    </p>
                    <p className="text-xs text-slate-500">24/7 qabul qilinadi</p>
                  </div>
                  <p className="ml-auto text-2xl font-bold text-[#0d4c8b]">1055</p>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">
                      Bugun qabul qilingan
                    </span>
                    <span className="text-lg font-bold text-[#0d4c8b]">145</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">
                      Bajarilgan murojaatlar
                    </span>
                    <span className="text-lg font-bold text-emerald-700">98</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">
                      Fuqaro mamnuniyati
                    </span>
                    <span className="text-lg font-bold text-amber-700">
                      4.6 / 5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
