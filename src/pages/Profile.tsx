import { useState } from "react";
import { motion } from "framer-motion";
import { User, Moon, Sun, ChevronRight, LogOut, Shield, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.phone || t("investor");
  const displayContact = user?.email || user?.phone || "";

  return (
    <div className="space-y-6 px-5 pb-4 pt-8">
      <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{t("profile")}</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
          <User className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{displayName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{displayContact}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("language")}
        </h3>
        <div className="flex gap-1.5">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                lang === l.code ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-warning" />}
            <span className="text-sm font-medium text-foreground">{isDark ? t("darkMode") : t("lightMode")}</span>
          </div>
          <div className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${isDark ? "bg-foreground" : "bg-border"}`}>
            <div className={`h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1.5">
        {[
          { icon: Shield, label: t("privacySecurity") },
          { icon: HelpCircle, label: t("helpSupport") },
        ].map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          </button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/15 bg-destructive/5 p-4 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("signOut")}
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
