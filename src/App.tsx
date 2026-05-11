import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ecosystemRouteEntries } from "./modules/ecosystem/config/menu";
import EcosystemLayout from "./modules/ecosystem/layouts/EcosystemLayout";
import ComingSoonPage from "./modules/ecosystem/pages/ComingSoonPage";
import ModullarPage from "./modules/ecosystem/pages/ModullarPage";
import Murojaat24ModulePage from "./modules/ecosystem/pages/Murojaat24ModulePage";
import SozlamalarPage from "./modules/ecosystem/pages/SozlamalarPage";
import { murojaat24Routes } from "./modules/murojaat24/config/routes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/ecosystem"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <EcosystemLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="modullar" replace />} />
            {ecosystemRouteEntries.map((routeEntry) => {
              const element =
                routeEntry.moduleKind === "modullar" ? (
                  <ModullarPage />
                ) : routeEntry.moduleKind === "murojaat24" ? (
                  <Murojaat24ModulePage />
                ) : routeEntry.moduleKind === "sozlamalar" ? (
                  <SozlamalarPage />
                ) : (
                  <ComingSoonPage />
                );

              return (
                <Route
                  key={routeEntry.id}
                  path={routeEntry.routePath}
                  element={element}
                />
              );
            })}
          </Route>
          {murojaat24Routes.map((route) => {
            const element = route.public ? (
              route.element
            ) : (
              <ProtectedRoute requiredRoles={route.requiredRoles}>
                {route.element}
              </ProtectedRoute>
            );

            return (
              <Route key={route.path} path={route.path} element={element} />
            );
          })}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
