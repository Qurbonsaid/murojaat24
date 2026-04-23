import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Inbox,
  LogOut,
  MapPin,
  Monitor,
  UserCircle2,
} from "lucide-react";

import AssignModal from "@/components/AssignModal";
import MapView from "@/components/MapView";
import NewRequestCard from "@/components/NewRequestCard";
import SpecialistCard from "@/components/SpecialistCard";
import StatsCard from "@/components/StatsCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "monitoring", icon: Monitor, label: "Monitoring" },
  { id: "new", icon: Inbox, label: "Yangi murojaatlar" },
  { id: "map", icon: MapPin, label: "Xarita" },
  { id: "stats", icon: BarChart3, label: "Statistika" },
] as const;

const newRequests = [
  {
    requestNumber: "MUR-2024-001240",
    type: "Elektr",
    address: "Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy",
    time: "5 daqiqa oldin",
  },
  {
    requestNumber: "MUR-2024-001241",
    type: "Suv",
    address: "Chilonzor tumani, Bunyodkor ko'chasi, 45-uy",
    time: "8 daqiqa oldin",
  },
  {
    requestNumber: "MUR-2024-001242",
    type: "Kanalizatsiya",
    address: "Mirzo Ulug'bek tumani, Shifokorlar ko'chasi, 23-uy",
    time: "12 daqiqa oldin",
  },
  {
    requestNumber: "MUR-2024-001243",
    type: "Elektr",
    address: "Olmazor tumani, Mustaqillik ko'chasi, 78-uy",
    time: "15 daqiqa oldin",
  },
  {
    requestNumber: "MUR-2024-001244",
    type: "Yo'l",
    address: "Sergeli tumani, Yangi hayot ko'chasi, 34-uy",
    time: "20 daqiqa oldin",
  },
];

const specialists = [
  {
    name: "Akmal Rahimov",
    position: "Elektr mutaxassisi",
    status: "available" as const,
    currentTasks: "2/8",
    location: "Yunusobod tumani",
  },
  {
    name: "Bobur Toshmatov",
    position: "Suv ta'minoti mutaxassisi",
    status: "busy" as const,
    currentTasks: "6/8",
    location: "Chilonzor tumani",
  },
  {
    name: "Davron Yusupov",
    position: "Kanalizatsiya mutaxassisi",
    status: "available" as const,
    currentTasks: "1/8",
    location: "Mirzo Ulug'bek tumani",
  },
  {
    name: "Eldor Karimov",
    position: "Yo'l ta'miri mutaxassisi",
    status: "available" as const,
    currentTasks: "3/8",
    location: "Olmazor tumani",
  },
];

const Murojaat24ModulePage = () => {
  const [activeMenu, setActiveMenu] =
    useState<(typeof menuItems)[number]["id"]>("monitoring");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");

  const selectedMenuLabel = useMemo(
    () =>
      menuItems.find((item) => item.id === activeMenu)?.label ?? "Monitoring",
    [activeMenu],
  );

  const handleAssignRequest = (requestNumber: string) => {
    setSelectedRequest(requestNumber);
    setAssignModalOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-[#c9d8f0] bg-white shadow-sm">
        <div className="grid min-h-[calc(100vh-124px)] lg:grid-cols-[215px_1fr]">
          <aside className="flex flex-col border-r border-[#d2def3] bg-[#1f2d47] text-white">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="h-5 w-5 text-[#4a93ff]" />
                <span className="text-2xl leading-none">Murojaat24</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[#3b82f6] text-white">
                    DM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    Dilshod Mirzayev
                  </p>
                  <p className="text-xs text-white/70">Dispatcher</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2 p-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMenu(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-[#3b82f6] text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </aside>

          <main className="bg-[#f8fbff] p-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-slate-900">
                {selectedMenuLabel}
              </h1>
              <p className="text-lg text-slate-500">
                Dispatcher paneli - Real vaqt kuzatuvi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base">
                      Yangi murojaatlar
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tayinlanishi kerak:{" "}
                      <span className="font-semibold text-foreground">
                        {newRequests.length}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-280px)] pr-3">
                      <div className="space-y-3">
                        {newRequests.map((request) => (
                          <NewRequestCard
                            key={request.requestNumber}
                            {...request}
                            onAssign={() =>
                              handleAssignRequest(request.requestNumber)
                            }
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base">
                      Real vaqt xaritasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapView compact />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 lg:col-span-1">
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base">
                      Bugungi statistika
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <StatsCard
                      icon={Inbox}
                      label="Qabul qilindi"
                      value={145}
                      iconColor="bg-blue-100 text-blue-600"
                    />
                    <StatsCard
                      icon={Clock}
                      label="Jarayonda"
                      value={32}
                      iconColor="bg-yellow-100 text-yellow-600"
                    />
                    <StatsCard
                      icon={CheckCircle}
                      label="Bajarilgan"
                      value={98}
                      iconColor="bg-green-100 text-green-600"
                    />
                    <StatsCard
                      icon={UserCircle2}
                      label="Kutayotgan"
                      value={15}
                      iconColor="bg-red-100 text-red-600"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base">
                      Faol mutaxassislar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-520px)] pr-3">
                      <div className="space-y-3">
                        {specialists.map((specialist) => (
                          <SpecialistCard
                            key={specialist.name}
                            {...specialist}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AssignModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        requestNumber={selectedRequest}
      />
    </>
  );
};

export default Murojaat24ModulePage;
