import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Minus, TrendingDown, ArrowRight } from "lucide-react";

const profiles = [
  {
    id: "bullish",
    label: "Bullish",
    icon: TrendingUp,
    description: "I'm comfortable with higher risk for potentially higher returns.",
    color: "text-success",
    bgActive: "border-success bg-success/10",
  },
  {
    id: "neutral",
    label: "Neutral",
    icon: Minus,
    description: "I prefer a balanced approach between safety and growth.",
    color: "text-primary",
    bgActive: "border-primary bg-primary/10",
  },
  {
    id: "bearish",
    label: "Bearish",
    icon: TrendingDown,
    description: "I prefer safety. Protecting my capital is more important.",
    color: "text-warning",
    bgActive: "border-warning bg-warning/10",
  },
];

const RiskProfile = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <p className="text-sm font-medium text-primary">Step 1 of 2</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          What's your investment style?
        </h1>
        <p className="text-sm text-muted-foreground">
          This helps us tailor recommendations to your comfort level.
        </p>
      </motion.div>

      <div className="flex-1 space-y-3">
        {profiles.map((p, i) => {
          const Icon = p.icon;
          const isActive = selected === p.id;
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(p.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                isActive ? p.bgActive : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 rounded-xl p-2.5 ${isActive ? p.bgActive : "bg-secondary"}`}>
                  <Icon className={`h-5 w-5 ${p.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-display text-base font-semibold text-foreground">{p.label}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={() => navigate("/financial-setup")}
        disabled={!selected}
        className="mt-8 w-full rounded-2xl py-6 text-base font-semibold"
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default RiskProfile;
