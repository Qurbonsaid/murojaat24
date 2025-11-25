export const governanceCategories = {
  "Hokim": [
    "Shahar Prokuraturasi",
    "Termiz shahar ichki ishlar boshqarmasi",
    "Termiz shahar adliya bo'limi",
    "Termiz shahar Mudofaa ishlari bo'limi",
    "Termiz shahar Favqulodda vaziyatlar bo'limi",
    "Majburiy ijro byurosi Termiz shahar bo'limi",
    "Iqtisodiy jinoyatlarga qarshi kurashish departamenti Termiz shahar bo'limi",
    "O'zbekiston Respublikasi Milliy gvardiyasi Termiz shahar bo'limi",
    "Termiz shahar soliq inspeksiyasi"
  ],
  "Moliya-iqtisodiyot va kambag'allikni qisqartirish": [
    "Shahar Iqtisodiyot va moliya bo'limi",
    "Termiz shahar bo'yicha G'aznachilik bo'linmasi",
    "Budgetdan tashqari Pensiya jamg'armasi Termiz shahar bo'limi",
    "Termiz shahar Kamba-g'allikni qisqartirish va bandlik bo'limi",
    "Termiz shahar statistika bo'limi",
    "Kadastr agentligi Davlat kadastrlari palatasi Termiz shahar filiali",
    "Termiz shahar Dehqon oziq-ovqat bozori MChJ",
    "Termiz shahar shaxsiy tarkib hujjatlari arxivi",
    'Termiz shahar "Termiz-Baktriya-Savdo" savdo kompleksi MChJ',
    'Termiz shahar "Yashil dunyo" markaziy dehqon oziq-ovqat bozori MChJ',
    'ATB "Agrobank" hududiy filiali',
    'AT "Mikrokreditbank" hududiy filiali',
    'TIF "Milliybank" Termiz shahar filiali'
  ],
  "Kapital qurilish, kommunikatsiyalar va kommunal xo'jalik": [
    "Termiz shahar qurilish va uy-joy kommunal xo'jaligi bo'limi",
    "Termiz shahar Obodonlashtirish boshqarmasi",
    'San\'at saroyi hududi va "Xotira maydoni"ni obodonlashtirish dep. (Termiz shahar hokimligi)',
    '"Amudaryo sohili" sport sog\'lomlashtirish markazi hududlarini obodonlashtirish dep.',
    "Ekologiya va atrof-muhitni muhofaza qilish bo'yicha Termiz shahar inspeksiyasi",
    '"Janubgazta\'minot" UK "Termizshahargaz" filiali',
    "Termiz shahar elektr ta'minoti korxonasi",
    "Termiz shahar energiya sotish bo'limi",
    "Termiz shahar suv ta'minoti bo'limi",
    '"BIO TEXNO EKO" MChJ Termiz shahar filiali',
    "Surxondaryo arxitektura va qurilish"
  ],
  "Yoshlar siyosati, ijtimoiy rivojlantirish va ma'naviy-ma'rifiy ishlar bo'yicha": [
    "Termiz shahar madaniyat bo'limi",
    '"Termiz oqshomi" gazetasi',
    'Termiz shahridagi "Inson" ijtimoiy xizmatlari markazi',
    "Yoshlar ishlari agentligi Termiz shahar bo'limi",
    "O'zbekiston Mahallalar uyushmasi Termiz shahar bo'limi",
    "Termiz shahar Davlat veterinariya va chorvachilikni rivojlantirish bo'limi",
    "Termiz shahar xalq ta'limi bo'limi",
    "Termiz shahar tibbiyot birlashmasi",
    "Termiz shahar Sanitariya-epidemiologik osoyishtalik bo'limi",
    "Ma'naviyat va ma'rifat markazi Termiz shahar bo'limi",
    "Ta'lim va fan xodimlari kasaba uyushmasi Termiz shahar bo'linmasi",
    'O\'zbekiston "Adolat" SDP Termiz shahar kengashi',
    "O'zLiDeP Termiz shahar kengashi",
    "O'zbekiston XDP Termiz shahar kengashi",
    "O'zbekiston Ekologik partiyasi Termiz shahar tashkiloti",
    "Termiz shahar nogironlar jamiyati",
    "O'zbekiston ko'zi ojizlar jamiyati",
    "Termiz shahar bolalar va o'smirlar sport maktabi",
    "Termiz kasb-hunar maktabi",
    "Termiz muhandislik-texnologiya instituti akademik litseyi",
    "Termiz davlat universiteti akademik litseyi",
    "Surxondaryo viloyati yuridik texnikumi",
    "Abu Ali ibn Sino nomidagi jamoa salomatligi tibbiyot texnikumi",
    "Termiz ixtisoslashgan san'at maktabi",
    "Termiz olimpiya va paralimpiya sport turlariga tayyorlash markazi"
  ],
  "Oila va xotin-qizlar masalalari bo'yicha": [
    '"Nuroniy" jamg\'armasi Termiz shahar bo\'limi',
    "O'zbekiston Qizil Yarim Oy jamiyati Termiz shahar tashkiloti"
  ],
  "Boshqa": [
    "Xalq deputatlari Termiz shahar kengashi",
    "Qishloq xo'jaligi boshqarmasi Termiz shahar bo'limi"
  ]
};

export const getGovernanceCategoryForOrganization = (organization: string): string => {
  for (const [category, orgs] of Object.entries(governanceCategories)) {
    if (orgs.includes(organization)) {
      return category;
    }
  }
  return "Boshqa";
};

export const getAllGovernanceCategories = () => Object.keys(governanceCategories);
