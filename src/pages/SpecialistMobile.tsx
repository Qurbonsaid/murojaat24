import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import BottomNavigation from "@/components/BottomNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const SpecialistMobile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("specialist_session");
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

  const specialistData = JSON.parse(localStorage.getItem("specialist_session") || "{}");

  const tasks = [
    {
      requestNumber: "MUR-2024-001245",
      organization: "Termiz shahar elektr ta'minoti korxonasi",
      address: "Abdulla Qodiriy ko'chasi, 12-uy",
      distance: "2.3 km narida",
      time: "30 daqiqa oldin",
      status: "new" as const,
      urgent: true,
      description: "Uyda elektr energiyasi yo'q. Barcha rozetkalar ishlamayapti. Tez yordam kerak.",
      phone: "+998 90 123 45 67",
      imageUrl: "/placeholder.svg",
    },
    {
      requestNumber: "MUR-2024-001246",
      organization: "Termiz shahar elektr ta'minoti korxonasi",
      address: "Bunyodkor ko'chasi, 45-uy",
      distance: "4.1 km narida",
      time: "1 soat oldin",
      status: "in-progress" as const,
      description: "Oshxonada rozetkalar ishlamayapti. Boshqa xonalar ishlayapti.",
      phone: "+998 91 234 56 78",
    },
    {
      requestNumber: "MUR-2024-001247",
      organization: "Termiz shahar elektr ta'minoti korxonasi",
      address: "Shifokorlar ko'chasi, 23-uy",
      distance: "5.8 km narida",
      time: "2 soat oldin",
      status: "new" as const,
      description: "Elektr hisoblagich buzilgan. Tekshirib ko'rish kerak.",
      phone: "+998 93 345 67 89",
    },
  ];

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Salom, {specialistData.name || "Akmal Rahimov"}!</h1>
              <p className="text-sm opacity-90">Bugun: 6 ta topshiriq</p>
            </div>
            <Avatar className="h-14 w-14 border-2 border-primary-foreground">
              <AvatarFallback className="bg-primary-foreground text-primary text-lg">
                {(specialistData.name || "AR")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="p-4 pb-24">
          <h2 className="text-xl font-bold text-foreground mb-4">Faol topshiriqlar</h2>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.requestNumber} {...task} onClick={() => handleTaskClick(task)} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Task Detail Modal */}
        {selectedTask && <TaskDetailModal open={modalOpen} onOpenChange={setModalOpen} task={selectedTask} />}
      </div>
    </div>
  );
};

export default SpecialistMobile;
