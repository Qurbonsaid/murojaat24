import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
import HistoryDetailModal from "./HistoryDetailModal";

const historyData = [
  {
    id: "MUR-2024-001230",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Navoiy ko'chasi, 15",
    completedDate: "18.11.2024",
    completedTime: "14:30",
    duration: "2 soat 15 daqiqa",
    rating: 5,
    citizenComment: "Juda yaxshi ish! Rahmat!",
    report: "Rozetka almashtirildi va simlar tekshirildi. Hammasi ishlayapti.",
    startTime: "12:15",
    endTime: "14:30",
  },
  {
    id: "MUR-2024-001225",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Mustaqillik, 78",
    completedDate: "18.11.2024",
    completedTime: "11:20",
    duration: "1 soat 45 daqiqa",
    rating: 4,
    citizenComment: "Yaxshi, lekin biroz kech keldi",
    report: "Elektr hisoblagich tekshirildi va qayta ulandi.",
    startTime: "09:35",
    endTime: "11:20",
  },
  {
    id: "MUR-2024-001218",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Bobur ko'chasi, 34",
    completedDate: "17.11.2024",
    completedTime: "16:45",
    duration: "2 soat 30 daqiqa",
    rating: 5,
    citizenComment: "Zo'r mutaxassis!",
    report: "Oshxonadagi barcha rozetkalar almashtirildi.",
    startTime: "14:15",
    endTime: "16:45",
  },
  {
    id: "MUR-2024-001210",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Amir Temur, 56",
    completedDate: "17.11.2024",
    completedTime: "10:15",
    duration: "1 soat 30 daqiqa",
    rating: 5,
    citizenComment: "Rahmat, tez va sifatli ish!",
    report: "Elektr simlar almashtirildi va izolyatsiya qilindi.",
    startTime: "08:45",
    endTime: "10:15",
  },
  {
    id: "MUR-2024-001205",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Chilonzor, 12-kvartal",
    completedDate: "16.11.2024",
    completedTime: "15:00",
    duration: "3 soat",
    rating: 4,
    citizenComment: "Yaxshi ish!",
    report: "To'liq elektr tizimi tekshirildi va ta'mirlandi.",
    startTime: "12:00",
    endTime: "15:00",
  },
  {
    id: "MUR-2024-001198",
    organization: "Termiz shahar elektr ta'minoti korxonasi",
    address: "Sergeli, 7-mavze",
    completedDate: "16.11.2024",
    completedTime: "09:30",
    duration: "1 soat 15 daqiqa",
    rating: 5,
    citizenComment: "Ajoyib!",
    report: "Avtomat o'chirgich almashtirildi.",
    startTime: "08:15",
    endTime: "09:30",
  },
];

const HistoryTab = () => {
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<typeof historyData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewTask = (task: typeof historyData[0]) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Bajarilgan ishlar tarixi</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-28 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hammasi</SelectItem>
            <SelectItem value="today">Bugun</SelectItem>
            <SelectItem value="week">Hafta</SelectItem>
            <SelectItem value="month">Oy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-foreground">
          Jami: <span className="font-bold">47 ta</span> ish bajarildi
        </p>
      </div>

      {/* Task List */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-3">
          {historyData.map((task) => (
            <div
              key={task.id}
              className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
            >
              <div className="flex">
                {/* Green left bar */}
                <div className="w-1.5 bg-green-500" />
                
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{task.id}</p>
                      <p className="text-xs text-muted-foreground">{task.organization}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(task.rating)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground mb-1">{task.address}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {task.completedDate}, {task.completedTime}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        {task.duration}da bajarildi
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleViewTask(task)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ko'rish
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* History Detail Modal */}
      {selectedTask && (
        <HistoryDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default HistoryTab;
