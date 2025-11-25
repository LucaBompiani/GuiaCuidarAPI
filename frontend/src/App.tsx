import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import Profile from "./pages/dashboard/Profile";
import Favorites from "./pages/dashboard/Favorites";
import Tips from "./pages/dashboard/Tips";
import Articles from "./pages/dashboard/Articles";
import Services from "./pages/dashboard/Services";
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
          <Route path="/explorar" element={<Explore />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Profile />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="dicas" element={<Tips />} />
            <Route path="artigos" element={<Articles />} />
            <Route path="servicos" element={<Services />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
