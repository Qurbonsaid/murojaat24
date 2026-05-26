import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import { useCurrentUser } from "@/lib/api/auth";
import {
  mapAssignmentToSpecialistTask,
  useAcceptAssignment,
  useMyCurrentAssignments,
  useStartAssignment,
  type SpecialistTask,
} from "@/lib/api/assignments";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import BottomNavigation from "@/components/BottomNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import HistoryTab from "@/components/specialist/HistoryTab";
import StatsTab from "@/components/specialist/StatsTab";
import ProfileTab from "@/components/specialist/ProfileTab";
import TaskCompletionModal from "@/components/specialist/TaskCompletionModal";

const SpecialistMobile = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<SpecialistTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;

  const currentAssignmentsQuery = useMyCurrentAssignments();
  const acceptAssignment = useAcceptAssignment();
  const startAssignment = useStartAssignment();

  const tasks = useMemo(
    () =>
      (currentAssignmentsQuery.data?.data ?? []).map((assignment) =>
        mapAssignmentToSpecialistTask(assignment),
      ),
    [currentAssignmentsQuery.data?.data],
  );

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

  const getErrorMessage = (error: unknown) =>
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Xatolik yuz berdi";

  const handleTaskClick = (task: SpecialistTask) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAcceptTask = async () => {
    if (!selectedTask) return;

    try {
      await acceptAssignment.mutateAsync(selectedTask.assignmentId);
      setModalOpen(false);
      toast.success("Topshiriq qabul qilindi");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStartAssignment = async () => {
    if (!selectedTask) return;

    try {
      await startAssignment.mutateAsync(selectedTask.assignmentId);
      setModalOpen(false);
      toast.success("Ish boshlandi");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStartCompletion = async () => {
    if (!selectedTask) return;

    if (selectedTask.assignmentStatus === "accepted") {
      try {
        await startAssignment.mutateAsync(selectedTask.assignmentId);
      } catch (error) {
        toast.error(getErrorMessage(error));
        return;
      }
    }

    setModalOpen(false);
    setCompletionModalOpen(true);
  };

  const handleCompleteTask = () => {
    setSelectedTask(null);
    setCompletionModalOpen(false);
    toast.success("Topshiriq yakunlandi");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <>
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

            <div className="p-4 pb-24">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Faol topshiriqlar
              </h2>
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-4">
                  {currentAssignmentsQuery.isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-40 w-full rounded-xl" />
                    ))
                  ) : currentAssignmentsQuery.isError ? (
                    <div className="text-center py-8 text-destructive text-sm">
                      {getErrorMessage(currentAssignmentsQuery.error)}
                    </div>
                  ) : (
                    <>
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.assignmentId}
                          {...task}
                          onClick={() => handleTaskClick(task)}
                        />
                      ))}
                      {tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Hozircha topshiriq yo'q</p>
                        </div>
                      )}
                    </>
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

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {selectedTask && (
          <TaskDetailModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            task={selectedTask}
            onAccept={
              selectedTask.assignmentStatus === "pending"
                ? handleAcceptTask
                : undefined
            }
            onStart={
              selectedTask.assignmentStatus === "accepted"
                ? handleStartAssignment
                : undefined
            }
            onStartCompletion={
              selectedTask.assignmentStatus === "in-progress"
                ? handleStartCompletion
                : undefined
            }
            isActionPending={
              acceptAssignment.isPending || startAssignment.isPending
            }
          />
        )}

        {selectedTask?.requestId && (
          <TaskCompletionModal
            open={completionModalOpen}
            onOpenChange={setCompletionModalOpen}
            task={{
              requestId: selectedTask.requestId,
              requestNumber: selectedTask.requestNumber,
            }}
            onComplete={handleCompleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default SpecialistMobile;
