import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ecosystemModules, type ModuleEntry } from "../../config/modules";

const ModullarPage = () => {
  const availableCount = ecosystemModules.filter(
    (module) => module.available
  ).length;
  const comingSoonCount = ecosystemModules.length - availableCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Modullar</h1>
        <p className="mt-1 text-muted-foreground">
          Termiz aqlli shahar ekotizimining barcha modullari bir joyda. Faol
          modulga kiring yoki kelgusidagi modullar bilan tanishing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            Jami yo‘nalishlar: {ecosystemModules.length}
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Faol modullar: {availableCount}
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Tez kunda: {comingSoonCount}
          </Badge>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ecosystemModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.id}
              className="group relative flex flex-col overflow-hidden border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-[#0d4c8b]/40 hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-xs",
                      module.accent
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  {module.available ? (
                    <Badge className="shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Faol
                    </Badge>
                  ) : (
                    <Badge className="shrink-0 bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Clock3 className="mr-1 h-3 w-3" />
                      Tez kunda
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {module.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {module.brief}
                  </p>
                </div>

                <div className="mt-auto pt-3">
                  {module.available ? (
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-[#0d4c8b] text-white hover:bg-[#0a3d70]"
                    >
                      <Link to={module.path}>
                        Modulga kirish
                        <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <Link to={module.path}>
                        Modul haqida
                        <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModullarPage;
