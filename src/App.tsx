import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import RiskProfile from "./pages/RiskProfile";
import FinancialSetup from "./pages/FinancialSetup";
import Home from "./pages/Home";
import Invest from "./pages/Invest";
import AIAdvisor from "./pages/AIAdvisor";
import StockDetail from "./pages/StockDetail";
import MutualFundDetail from "./pages/MutualFundDetail";
import Portfolio from "./pages/Portfolio";
import Learn from "./pages/Learn";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/risk-profile" element={<RiskProfile />} />
            <Route path="/financial-setup" element={<FinancialSetup />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/mutual-fund/:code" element={<MutualFundDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/invest" element={<Invest />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
