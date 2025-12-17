import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Bell,
  MapPin,
  Moon,
  Globe,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";
import PersonalInfoModal from "./PersonalInfoModal";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileTab = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const specialistData = JSON.parse(localStorage.getItem("specialist_session") || "{}");
  const name = specialistData.name || "Akmal Rahimov";

  const handleLogout = () => {
    localStorage.removeItem("specialist_session");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: User,
      label: "Shaxsiy ma'lumotlar",
      action: () => setPersonalInfoOpen(true),
      type: "link" as const,
    },
    {
      icon: Bell,
      label: "Bildirishnomalar",
      value: notifications,
      onChange: setNotifications,
      type: "toggle" as const,
    },
    {
      icon: MapPin,
      label: "Joylashuvni ulashish",
      value: locationSharing,
      onChange: setLocationSharing,
      type: "toggle" as const,
    },
    {
      icon: Moon,
      label: "Tungi rejim",
      value: darkMode,
      onChange: setDarkMode,
      type: "toggle" as const,
    },
    {
      icon: Globe,
      label: "Til",
      subtitle: "O'zbekcha",
      action: () => {},
      type: "link" as const,
    },
    {
      icon: Shield,
      label: "Parolni o'zgartirish",
      action: () => setChangePasswordOpen(true),
      type: "link" as const,
    },
    {
      icon: HelpCircle,
      label: "Yordam",
      action: () => {},
      type: "link" as const,
    },
    {
      icon: FileText,
      label: "Foydalanish shartlari",
      action: () => {},
      type: "link" as const,
    },
  ];

  return (
    <div className="p-4 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-foreground">{name}</h2>
        <p className="text-sm text-muted-foreground">Elektr mutaxassisi</p>
        <p className="text-xs text-muted-foreground">Termiz shahri</p>
        <span className="mt-2 px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
          Faol
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <p className="text-xl font-bold text-foreground">47</p>
          <p className="text-xs text-muted-foreground">Bajarilgan</p>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="flex items-center justify-center gap-1">
            <p className="text-xl font-bold text-foreground">4.8</p>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">Reyting</p>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <p className="text-xl font-bold text-foreground">2 yil</p>
          <p className="text-xs text-muted-foreground">Tajriba</p>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="h-[calc(100vh-480px)]">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-3 border border-border flex items-center justify-between"
                onClick={item.type === "link" ? item.action : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    {item.type === "link" && item.subtitle && (
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                {item.type === "toggle" ? (
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onChange}
                  />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Tizimdan chiqish
        </Button>
      </ScrollArea>

      {/* Modals */}
      <PersonalInfoModal open={personalInfoOpen} onOpenChange={setPersonalInfoOpen} />
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
};

export default ProfileTab;
