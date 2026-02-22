import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Vehicules from "./pages/Vehicules";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Conditions from "./pages/Conditions";
import SEOPage from "./pages/SEOPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminClients from "./pages/admin/AdminClients";
import AdminGuard from "@/components/AdminGuard";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/vehicules" element={<Vehicules />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/seo/:slug" element={<SEOPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><Dashboard /></AdminGuard>} />
        <Route path="/admin/vehicules" element={<AdminGuard><AdminVehicles /></AdminGuard>} />
        <Route path="/admin/reservations" element={<AdminGuard><AdminReservations /></AdminGuard>} />
        <Route path="/admin/clients" element={<AdminGuard><AdminClients /></AdminGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
