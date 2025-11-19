import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, Monitor, MapPin, BarChart3, LogOut, Inbox } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DispatcherSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const dispatcherData = JSON.parse(localStorage.getItem("dispatcher_session") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("dispatcher_session");
    toast({
      title: "Chiqildi",
      description: "Tizimdan muvaffaqiyatli chiqdingiz",
    });
    navigate("/login");
  };

  const menuItems = [
    { icon: Monitor, label: "Monitoring", path: "/dispatcher-dashboard" },
    { icon: Inbox, label: "Yangi murojaatlar", path: "/dispatcher-dashboard#new" },
    { icon: MapPin, label: "Xarita", path: "/dispatcher-dashboard#map" },
    { icon: BarChart3, label: "Statistika", path: "/dispatcher-dashboard#stats" },
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
            <AvatarFallback className="bg-primary text-primary-foreground">
              {dispatcherData.name?.split(" ").map((n: string) => n[0]).join("") || "DM"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{dispatcherData.name || "Dilshod Mirzayev"}</p>
            <p className="text-sm text-slate-400 truncate">Dispatcher</p>
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

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Chiqish
        </Button>
      </div>
    </aside>
  );
};

export default DispatcherSidebar;
