import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  CheckCircle,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useCurrentUser, useLogout } from "@/lib/api/auth";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const logoutMutation = useLogout();

  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;

  const name =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user?.phone ||
    "Foydalanuvchi";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Chiqildi",
        description: "Tizimdan muvaffaqiyatli chiqdingiz",
      });
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Chiqishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/manager-dashboard" },
    {
      icon: CheckCircle,
      label: "Nazorat qilish",
      path: "/manager-dashboard#review",
    },
    { icon: BarChart3, label: "Statistika", path: "/manager-dashboard#stats" },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Murojaat24</span>
        </div>

        <div className="flex items-center gap-3">
          <Avatar>
            {user?.profile?.avatar ? (
              <AvatarImage src={user.profile.avatar} alt={name} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "GS"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{name || "Foydalanuvchi"}</p>
            <p className="text-sm text-slate-400 truncate">Menjer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path.split("#")[0];
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        variant="ghost"
        className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="h-5 w-5 mr-3" />
        {name}
      </Button>
      <p className="text-sm text-slate-400 truncate">Menjer</p>
    </aside>
  );
};

export default ManagerSidebar;
