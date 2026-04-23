import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ecosystemRouteEntries } from "@/modules/ecosystem/config/menu";
import EcosystemLayout from "@/modules/ecosystem/layouts/EcosystemLayout";
import ComingSoonPage from "@/modules/ecosystem/pages/ComingSoonPage";
import Murojaat24ModulePage from "@/modules/ecosystem/pages/Murojaat24ModulePage";
import { murojaat24Routes } from "@/modules/murojaat24/config/routes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/ecosystem" replace />} />
          <Route path="/ecosystem" element={<EcosystemLayout />}>
            <Route index element={<Navigate to="hudud" replace />} />
            {ecosystemRouteEntries.map((routeEntry) => (
              <Route
                key={routeEntry.id}
                path={routeEntry.routePath}
                element={
                  routeEntry.moduleKind === "murojaat24" ? (
                    <Murojaat24ModulePage />
                  ) : (
                    <ComingSoonPage />
                  )
                }
              />
            ))}
          </Route>
          {murojaat24Routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
