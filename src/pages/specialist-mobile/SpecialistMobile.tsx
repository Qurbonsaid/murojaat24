import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveAssetUrl } from "@/lib/api/client";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import BottomNavigation from "@/components/BottomNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import HistoryTab from "@/components/specialist/HistoryTab";
import StatsTab from "@/components/specialist/StatsTab";
import ProfileTab from "@/components/specialist/ProfileTab";
import TaskCompletionModal from "@/components/specialist/TaskCompletionModal";
import { useCurrentUser } from "@/lib/api/auth";

interface Task {
  requestNumber: string;
  organization: string;
  address: string;
  distance: string;
  time: string;
  status: "new" | "in-progress";
  urgent?: boolean;
  description: string;
  phone: string;
  imageUrl?: string;
}

const initialTasks: Task[] = [
  {
    requestNumber: "MUR-2024-001245",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Abdulla Qodiriy ko'chasi, 12-uy",
    distance: "2.3 km narida",
    time: "30 daqiqa oldin",
    status: "new",
    urgent: true,
    description:
      "Uyda elektr energiyasi yo'q. Barcha rozetkalar ishlamayapti. Tez yordam kerak.",
    phone: "+998 90 123 45 67",
    imageUrl: "/placeholder.svg",
  },
  {
    requestNumber: "MUR-2024-001246",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Bunyodkor ko'chasi, 45-uy",
    distance: "4.1 km narida",
    time: "1 soat oldin",
    status: "in-progress",
    description:
      "Oshxonada rozetkalar ishlamayapti. Boshqa xonalar ishlayapti.",
    phone: "+998 91 234 56 78",
  },
  {
    requestNumber: "MUR-2024-001247",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Shifokorlar ko'chasi, 23-uy",
    distance: "5.8 km narida",
    time: "2 soat oldin",
    status: "new",
    description: "Elektr hisoblagich buzilgan. Tekshirib ko'rish kerak.",
    phone: "+998 93 345 67 89",
  },
];

const SpecialistMobile = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;

  const firstName = user?.profile?.firstName?.trim();
  const lastName = user?.profile?.lastName?.trim();
  const name =
    [firstName, lastName].filter(Boolean).join(" ") ||
    user?.phone ||
    "Mutaxassis";
  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "SP";

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAcceptTask = (requestNumber: string) => {
    setTasks(
      tasks.map((task) =>
        task.requestNumber === requestNumber
          ? { ...task, status: "in-progress" as const }
          : task,
      ),
    );
    setModalOpen(false);
  };

  const handleStartCompletion = () => {
    setModalOpen(false);
    setCompletionModalOpen(true);
  };

  const handleCompleteTask = () => {
    if (selectedTask) {
      setTasks(
        tasks.filter(
          (task) => task.requestNumber !== selectedTask.requestNumber,
        ),
      );
      setSelectedTask(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <>
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Salom, {name}!</h1>
                  <p className="text-sm opacity-90">
                    Bugun: {tasks.length} ta topshiriq
                  </p>
                </div>
                <Avatar className="h-14 w-14 border-2 border-primary-foreground">
                  {user?.profile?.avatar ? (
                    <AvatarImage
                      src={resolveAssetUrl(user.profile.avatar)}
                      alt={name}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary-foreground text-primary text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Active Tasks */}
            <div className="p-4 pb-24">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Faol topshiriqlar
              </h2>
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.requestNumber}
                      {...task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Hozircha topshiriq yo'q</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        );
      case "history":
        return <HistoryTab />;
      case "stats":
        return <StatsTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md relative">
        <div className="animate-fade-in">{renderTabContent()}</div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            task={selectedTask}
            onAccept={() => handleAcceptTask(selectedTask.requestNumber)}
            onStartCompletion={handleStartCompletion}
          />
        )}

        {/* Task Completion Modal */}
        {selectedTask && (
          <TaskCompletionModal
            open={completionModalOpen}
            onOpenChange={setCompletionModalOpen}
            task={selectedTask}
            onComplete={handleCompleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default SpecialistMobile;
