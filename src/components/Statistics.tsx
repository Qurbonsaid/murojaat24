import { ClipboardCheck, Clock3, MapPin, Users2 } from "lucide-react";

const stats = [
  {
    icon: ClipboardCheck,
    value: "24 500+",
    label: "Qabul qilingan murojaatlar",
  },
  {
    icon: Users2,
    value: "180 000+",
    label: "Xizmatdan foydalangan fuqarolar",
  },
  {
    icon: MapPin,
    value: "42",
    label: "Qamrab olingan mahallalar",
  },
  {
    icon: Clock3,
    value: "18 soat",
    label: "O'rtacha javob vaqti",
  },
];

const Statistics = () => {
  return (
    <section id="statistika" className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Raqamlarda Termiz
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Fuqarolar ishonchiga asoslangan platforma
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Termiz aqlli shahar platformasi har kuni minglab fuqarolarga xizmat
            ko'rsatmoqda va shahar xizmatlarini yanada shaffof qilmoqda.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sky-50/60 p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d4c8b] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-3xl font-bold tracking-tight text-[#0d4c8b] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
