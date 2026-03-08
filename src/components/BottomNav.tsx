import { useLocation, useNavigate } from "react-router-dom";
import { Home, TrendingUp, PieChart, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const tabs = [
  { path: "/home", key: "home" as const, icon: Home },
  { path: "/invest", key: "invest" as const, icon: TrendingUp },
  { path: "/portfolio", key: "portfolio" as const, icon: PieChart },
  { path: "/learn", key: "learn" as const, icon: BookOpen },
  { path: "/profile", key: "profile" as const, icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1.5 h-0.5 w-5 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                className={`h-[18px] w-[18px] transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                }`}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {t(tab.key)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
