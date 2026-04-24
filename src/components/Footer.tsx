import { Landmark, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Shahar xizmatlari", href: "#xizmatlar" },
  { label: "Raqamlarda Termiz", href: "#statistika" },
  { label: "Fuqarolar ishtiroki", href: "#ishtirok" },
];

const services = [
  "Murojaat va chaqiruvlar",
  "Kommunal xizmatlar",
  "Mahalla xizmatlari",
  "Shahar nazorati",
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="bog-lanish" className="bg-[#0b3d72] text-sky-100">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Landmark className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-base font-semibold text-white">
                Termiz aqlli shahar
              </p>
              <p className="text-xs text-sky-200">
                Fuqarolar uchun rasmiy platforma
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-sky-200">
            Termiz shahar hokimligining raqamli xizmatlar platformasi. Shahar
            hayotini qulayroq va shaffofroq qilish uchun yaratilgan.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Tezkor havolalar
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sky-200 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Xizmatlar
          </h4>
          <ul className="space-y-2 text-sm text-sky-200">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Bog'lanish
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-sky-300" />
              <span>Termiz shahar, Surxondaryo viloyati</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sky-300" />
              <a
                href="tel:1055"
                className="transition-colors hover:text-white"
              >
                Ishonch telefoni: 1055
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sky-300" />
              <a
                href="mailto:info@termiz.uz"
                className="transition-colors hover:text-white"
              >
                info@termiz.uz
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-sky-200 sm:flex-row">
          <p>© {year} Termiz shahar hokimligi. Barcha huquqlar himoyalangan.</p>
          <p>Termiz aqlli shahar — raqamli xizmatlar platformasi</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
