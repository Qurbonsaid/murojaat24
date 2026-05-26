import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  mapAssignmentToSpecialistHistoryItem,
  useMyAssignmentHistory,
  type SpecialistHistoryItem,
} from "@/lib/api/assignments";
import { Eye, Star } from "lucide-react";

import HistoryDetailModal from "./HistoryDetailModal";

const HistoryTab = () => {
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<SpecialistHistoryItem | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const historyQuery = useMyAssignmentHistory({ limit: 10 });

  const historyItems = useMemo(
    () =>
      (historyQuery.data?.pages ?? []).flatMap((page) =>
        (page.data ?? []).map((assignment) =>
          mapAssignmentToSpecialistHistoryItem(assignment),
        ),
      ),
    [historyQuery.data?.pages],
  );

  const totalCount =
    historyQuery.data?.pages[0]?.pagination?.total ?? historyItems.length;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !historyQuery.hasNextPage || historyQuery.isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          historyQuery.fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    historyQuery.hasNextPage,
    historyQuery.isFetchingNextPage,
    historyQuery.fetchNextPage,
    historyItems.length,
  ]);

  const handleViewTask = (task: SpecialistHistoryItem) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const renderStars = (rating: number) => {
    if (rating <= 0) {
      return (
        <span className="text-xs text-muted-foreground">Baholanmagan</span>
      );
    }

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
        )}
      />
    ));
  };

  const errorMessage =
    historyQuery.error instanceof ApiError
      ? historyQuery.error.message
      : historyQuery.error instanceof Error
        ? historyQuery.error.message
        : "Tarix yuklanmadi";

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          Bajarilgan ishlar tarixi
        </h2>
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

      <div className="bg-primary/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-foreground">
          Jami: <span className="font-bold">{totalCount} ta</span> ish bajarildi
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-3">
          {historyQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))
          ) : historyQuery.isError ? (
            <div className="text-center py-8 text-destructive text-sm">
              {errorMessage}
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Hozircha bajarilgan ishlar yo'q
            </div>
          ) : (
            historyItems.map((task) => (
              <div
                key={task.assignmentId}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
              >
                <div className="flex">
                  <div className="w-1.5 bg-green-500" />

                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {task.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.organization}
                        </p>
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
                          {task.duration} da bajarildi
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
            ))
          )}

          <div ref={loadMoreRef} className="h-4" />

          {historyQuery.isFetchingNextPage && (
            <Skeleton className="h-20 w-full rounded-xl" />
          )}
        </div>
      </ScrollArea>

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
