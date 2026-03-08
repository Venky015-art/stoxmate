import { useState } from "react";
import { motion } from "framer-motion";
import { User, Globe, Moon, Sun, ChevronRight, LogOut, Shield, HelpCircle } from "lucide-react";

const languages = ["English", "తెలుగు", "हिन्दी"];

const Profile = () => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("English");

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="space-y-6 px-5 pb-4 pt-6">
      <h1 className="font-display text-xl font-bold text-foreground">Profile</h1>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-foreground">Investor</h3>
          <p className="text-sm text-muted-foreground">+91 98765 43210</p>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe className="h-4 w-4" /> Language
        </h3>
        <div className="flex gap-2">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                lang === l ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="h-5 w-5 text-accent" /> : <Sun className="h-5 w-5 text-warning" />}
            <span className="text-sm font-medium text-foreground">{isDark ? "Dark Mode" : "Light Mode"}</span>
          </div>
          <div className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${isDark ? "bg-primary" : "bg-border"}`}>
            <div className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </button>
      </motion.div>

      {/* Menu Items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
        {[
          { icon: Shield, label: "Privacy & Security" },
          { icon: HelpCircle, label: "Help & Support" },
        ].map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
