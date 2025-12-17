import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Clock, TrendingUp, Zap, Award, Trophy, Lock } from "lucide-react";

const StatsTab = () => {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  const weeklyData = [
    { day: "Dush", value: 6 },
    { day: "Sesh", value: 8 },
    { day: "Chor", value: 5 },
    { day: "Pay", value: 7 },
    { day: "Jum", value: 9 },
    { day: "Shan", value: 4 },
    { day: "Yak", value: 8 },
  ];

  const maxValue = Math.max(...weeklyData.map((d) => d.value));
  const todayIndex = 4; // Friday as example

  const badges = [
    {
      icon: Star,
      title: "Top mutaxassis",
      description: "Oylik eng yuqori baho",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      unlocked: true,
    },
    {
      icon: Zap,
      title: "Tezkor",
      description: "10 ta ishni 1 kunda bajarish",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      unlocked: true,
    },
    {
      icon: Award,
      title: "Ishonchli",
      description: "50 ta ish rad etilmagan",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      unlocked: true,
    },
    {
      icon: Trophy,
      title: "Legenda",
      description: "100 ta 5 yulduzli baho",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      unlocked: false,
    },
  ];

  const recentRatings = [
    { comment: "Juda yaxshi ish!", rating: 5, date: "18.11.2024" },
    { comment: "Rahmat!", rating: 5, date: "17.11.2024" },
    { comment: "Yaxshi, lekin biroz kech keldi", rating: 4, date: "17.11.2024" },
    { comment: "Zo'r mutaxassis!", rating: 5, date: "16.11.2024" },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Mening statistikam</h2>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "today" as const, label: "Bugun" },
          { id: "week" as const, label: "Hafta" },
          { id: "month" as const, label: "Oy" },
        ].map((p) => (
          <Button
            key={p.id}
            variant={period === p.id ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 rounded-xl p-4">
              <CheckCircle className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">47</p>
              <p className="text-sm text-muted-foreground">Bajarilgan</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4">
              <Star className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-sm text-muted-foreground">O'rtacha baho</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4">
              <Clock className="h-6 w-6 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">2.3</p>
              <p className="text-sm text-muted-foreground">O'rtacha soat</p>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4">
              <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Muvaffaqiyat</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Haftalik faoliyat</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      index === todayIndex ? "bg-primary" : "bg-primary/40"
                    }`}
                    style={{ height: `${(day.value / maxValue) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                  <span className="text-xs font-medium text-foreground">{day.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Yutuqlar</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-28 rounded-xl p-3 ${badge.bgColor} ${
                      !badge.unlocked ? "opacity-50" : ""
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`h-8 w-8 ${badge.color} mb-2`} />
                      {!badge.unlocked && (
                        <Lock className="h-4 w-4 text-muted-foreground absolute -top-1 -right-1" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-foreground">{badge.title}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Ratings */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Oxirgi baholar</h3>
            <div className="space-y-2">
              {recentRatings.map((rating, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-3 border border-border flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{rating.comment}</p>
                    <p className="text-xs text-muted-foreground">{rating.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5 ml-2">
                    {renderStars(rating.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatsTab;
