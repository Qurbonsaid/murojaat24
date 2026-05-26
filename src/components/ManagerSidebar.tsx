import { Link, useLocation } from "react-router-dom";
import { BarChart3, CheckCircle, FileText, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/api/auth";
import { resolveAssetUrl } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ManagerSidebar = () => {
  const location = useLocation();

  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;

  const name =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user?.phone ||
    "Foydalanuvchi";

  const menuItems = [
    {
      icon: CheckCircle,
      label: "Nazorat qilish",
      path: "/manager/nazorat",
    },
    {
      icon: BarChart3,
      label: "Statistika",
      path: "/manager/statistika",
    },
    {
      icon: Users,
      label: "Foydalanuvchilar",
      path: "/manager/foydalanuvchilar",
    },
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
              <AvatarImage
                src={resolveAssetUrl(user.profile.avatar)}
                alt={name}
              />
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
            <p className="text-sm text-slate-400 truncate">Menejer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-300 hover:bg-slate-700",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
