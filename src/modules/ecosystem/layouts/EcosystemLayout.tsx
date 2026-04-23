import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { ecosystemMenuItems } from "../config/menu";

type EcosystemSidebarNavigationProps = {
  onNavigate?: () => void;
};

const EcosystemSidebarNavigation = ({
  onNavigate,
}: EcosystemSidebarNavigationProps) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isActivePath = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  useEffect(() => {
    setOpenSections((current) => {
      const next = { ...current };

      ecosystemMenuItems.forEach((item) => {
        if (!item.children?.length) {
          return;
        }

        if (location.pathname.startsWith(item.path)) {
          next[item.id] = true;
        }
      });

      return next;
    });
  }, [location.pathname]);

  return (
    <nav className="p-3">
      <ul className="space-y-1.5">
        {ecosystemMenuItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const isParentActive = isActivePath(item.path);

          return (
            <li key={item.id} className="space-y-1">
              <div
                className={cn(
                  "flex items-center rounded-lg border border-transparent transition-colors",
                  isParentActive
                    ? "border-sky-400/40 bg-sky-500/20"
                    : "hover:bg-[#172a58]",
                )}
              >
                <NavLink
                  to={item.path}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-100"
                  onClick={onNavigate}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white",
                      isParentActive ? "bg-sky-500" : "bg-[#2663b6]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </NavLink>

                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => toggleSection(item.id)}
                    className="mr-2 rounded-md p-1 text-slate-300 transition-colors hover:bg-[#2a457f] hover:text-white"
                    aria-label={`${item.label} menyusini ochish`}
                  >
                    {openSections[item.id] ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {hasChildren && openSections[item.id] && (
                <ul className="ml-4 space-y-1 border-l border-[#385897] pl-3">
                  {item.children?.map((child) => {
                    const isChildActive = isActivePath(child.path);

                    return (
                      <li key={child.id}>
                        <NavLink
                          to={child.path}
                          onClick={onNavigate}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "bg-sky-500/90 font-medium text-white"
                              : "text-slate-300 hover:bg-[#172a58] hover:text-white",
                          )}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const SidebarPanel = ({ onNavigate }: EcosystemSidebarNavigationProps) => {
  return (
    <div className="flex h-full flex-col bg-[#0d1a3f] text-slate-100">
      <div className="border-b border-[#233d76] px-4 py-3">
        <p className="text-base font-semibold">Modullar menyusi</p>
        <p className="text-xs text-slate-400">
          Har bir modul alohida sahifada yuritiladi
        </p>
      </div>
      <ScrollArea className="flex-1">
        <EcosystemSidebarNavigation onNavigate={onNavigate} />
      </ScrollArea>
    </div>
  );
};

const EcosystemLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const location = useLocation();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(currentDateTime),
    [currentDateTime],
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(currentDateTime),
    [currentDateTime],
  );

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#edf3fb]">
      <header className="sticky top-0 z-30 border-b border-[#0a4679] bg-[#0d5c9f] text-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#0a4679] hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] border-r-0 p-0">
              <SidebarPanel onNavigate={() => setMobileSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link to="/ecosystem/hudud" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              T
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold sm:text-base">
                Termiz aqlli shahar
              </span>
              <span className="hidden text-white/70 sm:inline">|</span>
              <span className="hidden text-sm text-sky-100 sm:inline">
                Modullar
              </span>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2 text-right text-xs sm:gap-4 sm:text-sm">
            <div>
              <p className="font-semibold">{formattedDate}</p>
              <p className="text-sky-100">{formattedTime}</p>
            </div>
            <div className="hidden items-center gap-2 rounded-md bg-[#0a4679]/80 px-3 py-1.5 sm:flex">
              <UserCircle2 className="h-4 w-4" />
              <div>
                <p className="leading-tight">A1Tech</p>
                <p className="text-[11px] leading-tight text-sky-100">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        <aside className="hidden w-[285px] border-r border-[#233d76] lg:block">
          <SidebarPanel />
        </aside>

        <main className="flex-1 p-3 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EcosystemLayout;
