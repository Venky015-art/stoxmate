import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/onboarding"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground">
          <TrendingUp className="h-8 w-8 text-background" strokeWidth={2} />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold tracking-tight text-foreground"
        >
          StoxMate
        </motion.h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-center text-sm text-muted-foreground"
      >
        Investing made simple
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="mt-16"
      >
        <div className="h-0.5 w-12 animate-pulse-soft rounded-full bg-foreground/20" />
      </motion.div>
    </div>
  );
};

export default Splash;
