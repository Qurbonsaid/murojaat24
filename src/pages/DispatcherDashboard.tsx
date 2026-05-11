import { useState } from "react";
import DispatcherSidebar from "@/components/DispatcherSidebar";
import StatsCard from "@/components/StatsCard";
import UserProfileMenu from "@/components/UserProfileMenu";
import NewRequestCard from "@/components/NewRequestCard";
import SpecialistCard from "@/components/SpecialistCard";
import MapView from "@/components/MapView";
import AssignModal from "@/components/AssignModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Inbox } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DispatcherDashboard = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string>("");

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

  const handleAssignRequest = (requestNumber: string) => {
    setSelectedRequest(requestNumber);
    setAssignModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DispatcherSidebar />

      <main className="flex-1 ml-64 p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Monitoring
            </h1>
            <p className="text-muted-foreground">
              Dispatcher paneli - Real vaqt kuzatuvi
            </p>
          </div>
          <UserProfileMenu />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT COLUMN - New Requests */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Yangi murojaatlar</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tayinlanishi kerak:{" "}
                  <span className="font-semibold text-foreground">
                    {newRequests.length}
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
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

          {/* CENTER COLUMN - Map */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real vaqt xaritasi</CardTitle>
              </CardHeader>
              <CardContent>
                <MapView />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Statistics & Specialists */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bugungi statistika</CardTitle>
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
                  icon={AlertCircle}
                  label="Kutayotgan"
                  value={15}
                  iconColor="bg-red-100 text-red-600"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Faol mutaxassislar</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {specialists.map((specialist) => (
                      <SpecialistCard key={specialist.name} {...specialist} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AssignModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        requestNumber={selectedRequest}
      />
    </div>
  );
};

export default DispatcherDashboard;
