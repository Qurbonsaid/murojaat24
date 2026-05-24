import { Link, useLocation } from "react-router-dom";
import { ClipboardList, FileText, Inbox } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/api/auth";
import { resolveAssetUrl } from "@/lib/api/client";

const DispatcherSidebar = () => {
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

  const roleLabel =
    user?.role === "admin" ? "Hokimiyat" : user?.role === "dispatcher" ? "Dispetcher" : "Dispetcher";

  const menuItems = [
    {
      icon: Inbox,
      label: "Yangi murojaatlar",
      path: "/dispatcher-dashboard/appeals",
    },
    {
      icon: ClipboardList,
      label: "Topshiriqlar",
      path: "/dispatcher-dashboard/assignments",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 flex min-h-screen w-64 flex-col bg-slate-800 text-white">
      <div className="border-b border-slate-700 p-6">
        <div className="mb-6 flex items-center gap-2">
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
                .map((part: string) => part[0])
                .join("") || "DM"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{name}</p>
            <p className="truncate text-sm text-slate-400">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
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
    </aside>
  );
};

export default DispatcherSidebar;
