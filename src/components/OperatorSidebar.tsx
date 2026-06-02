import { Link, useLocation } from "react-router-dom";
import { FileText, FilePlus, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const OperatorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: FilePlus,
      label: "Yangi murojaat",
      path: "/operator-dashboard/new",
    },
    {
      icon: ListChecks,
      label: "Murojaatlar ro'yxati",
      path: "/operator-dashboard/list",
    },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Murojaat24</span>
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

export default OperatorSidebar;
