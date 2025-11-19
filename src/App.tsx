import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubmitRequest from "./pages/SubmitRequest";
import TrackRequest from "./pages/TrackRequest";
import RoleSelect from "./pages/RoleSelect";
import OperatorDashboard from "./pages/OperatorDashboard";
import DispatcherDashboard from "./pages/DispatcherDashboard";
import SpecialistMobile from "./pages/SpecialistMobile";
import ManagerDashboard from "./pages/ManagerDashboard";
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
          <Route path="/murojaat-yuborish" element={<SubmitRequest />} />
          <Route path="/kuzatish" element={<TrackRequest />} />
          <Route path="/login" element={<RoleSelect />} />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/dispatcher-dashboard" element={<DispatcherDashboard />} />
          <Route path="/specialist-mobile" element={<SpecialistMobile />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
