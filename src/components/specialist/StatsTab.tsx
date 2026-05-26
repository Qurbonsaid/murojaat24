import { useMemo, useState } from "react";
import {
  Award,
  CheckCircle,
  Clock,
  Lock,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  useMonthlyStatistics,
  useSpecialistDetailStatistics,
  type SpecialistAchievementBadge,
  type SpecialistStatisticsPeriod,
} from "@/lib/api/statistics";

const BADGE_ICONS = [Star, Zap, Award, Trophy];

const StatsTab = () => {
  const [period, setPeriod] = useState<SpecialistStatisticsPeriod>("week");
  const currentUserQuery = useCurrentUser();
  const specialistId = currentUserQuery.data?._id;

  const statsQuery = useSpecialistDetailStatistics(specialistId, period);
  const monthlyQuery = useMonthlyStatistics(new Date().getFullYear(), {
    enabled: period === "month",
  });

  const stats = statsQuery.data;

  const chartData = useMemo(() => {
    if (period === "month" && monthlyQuery.data?.length) {
      return monthlyQuery.data;
    }
    return stats?.weeklyActivity ?? [];
  }, [monthlyQuery.data, period, stats?.weeklyActivity]);

  const maxValue = Math.max(1, ...chartData.map((point) => point.value));
  const todayIndex =
    period === "week" && chartData.length > 0
      ? Math.min(new Date().getDay(), chartData.length - 1)
      : -1;

  const chartTitle =
    period === "today"
      ? "Bugungi faoliyat"
      : period === "week"
        ? "Haftalik faoliyat"
        : "Oylik faoliyat";

  const resolveErrorMessage = (error: unknown) =>
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Statistika yuklanmadi";

  const renderStars = (rating: number) =>
    Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    ));

  const formatMetric = (value: number, suffix = "") => {
    if (!Number.isFinite(value) || value <= 0) return "—";
    return `${value}${suffix}`;
  };

  const isLoading =
    currentUserQuery.isLoading ||
    statsQuery.isLoading ||
    (period === "month" && monthlyQuery.isLoading);

  const isError = statsQuery.isError;

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Mening statistikam</h2>
      </div>

      <div className="flex gap-2 mb-4">
        {(
          [
            { id: "today" as const, label: "Bugun" },
            { id: "week" as const, label: "Hafta" },
            { id: "month" as const, label: "Oy" },
          ] as const
        ).map((item) => (
          <Button
            key={item.id}
            variant={period === item.id ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setPeriod(item.id)}
            disabled={isLoading}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </>
          ) : isError ? (
            <div className="text-center py-8 text-destructive text-sm">
              {resolveErrorMessage(statsQuery.error)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <CheckCircle className="h-6 w-6 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {formatMetric(stats?.completed ?? 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Bajarilgan</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4">
                  <Star className="h-6 w-6 text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.averageRating
                      ? stats.averageRating.toFixed(1)
                      : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">O'rtacha baho</p>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4">
                  <Clock className="h-6 w-6 text-yellow-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.averageDurationHours
                      ? stats.averageDurationHours.toFixed(1)
                      : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">O'rtacha soat</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4">
                  <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.successRate
                      ? `${stats.successRate.toFixed(0)}%`
                      : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Muvaffaqiyat</p>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  {chartTitle}
                </h3>
                {chartData.length > 0 ? (
                  <div className="flex items-end justify-between h-32 gap-2">
                    {chartData.map((point, index) => (
                      <div
                        key={`${point.label}-${index}`}
                        className="flex-1 flex flex-col items-center min-w-0"
                      >
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all",
                            index === todayIndex ? "bg-primary" : "bg-primary/40",
                          )}
                          style={{
                            height: `${Math.max(8, (point.value / maxValue) * 100)}%`,
                          }}
                        />
                        <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
                          {point.label}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {point.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Tanlangan davr uchun faoliyat ma'lumoti yo'q
                  </p>
                )}
              </div>

              {stats?.badges && stats.badges.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Yutuqlar</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {stats.badges.map((badge, index) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        iconIndex={index}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Oxirgi baholar
                </h3>
                {stats?.recentRatings && stats.recentRatings.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentRatings.map((rating, index) => (
                      <div
                        key={`${rating.date}-${index}`}
                        className="bg-card rounded-lg p-3 border border-border flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2">
                            {rating.comment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rating.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {renderStars(rating.rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6 bg-muted/40 rounded-lg">
                    Hozircha baholar yo'q
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const BadgeCard = ({
  badge,
  iconIndex,
}: {
  badge: SpecialistAchievementBadge;
  iconIndex: number;
}) => {
  const Icon = BADGE_ICONS[iconIndex % BADGE_ICONS.length];
  const color = badge.unlocked ? "text-yellow-500" : "text-muted-foreground";
  const bgColor = badge.unlocked ? "bg-yellow-500/10" : "bg-muted";

  return (
    <div
      className={cn(
        "flex-shrink-0 w-28 rounded-xl p-3",
        bgColor,
        !badge.unlocked && "opacity-50",
      )}
    >
      <div className="relative">
        <Icon className={cn("h-8 w-8 mb-2", color)} />
        {!badge.unlocked ? (
          <Lock className="h-4 w-4 text-muted-foreground absolute -top-1 -right-1" />
        ) : null}
      </div>
      <p className="text-xs font-semibold text-foreground">{badge.title}</p>
      <p className="text-[10px] text-muted-foreground">{badge.description}</p>
    </div>
  );
};

export default StatsTab;
