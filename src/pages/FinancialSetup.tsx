import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

const goals = ["Emergency Fund", "Retirement", "Buy a House", "Children's Education", "Wealth Growth"];

const FinancialSetup = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState([30000]);
  const [savings, setSavings] = useState([5000]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [horizon, setHorizon] = useState([5]);

  const fmt = (v: number) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;

  return (
    <div className="flex min-h-screen flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <p className="text-sm font-medium text-primary">Step 2 of 2</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Your financial snapshot</h1>
        <p className="text-sm text-muted-foreground">Help us understand your finances better.</p>
      </motion.div>

      <div className="flex-1 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Monthly Income</label>
            <span className="font-display text-lg font-bold text-primary">{fmt(income[0])}</span>
          </div>
          <Slider value={income} onValueChange={setIncome} min={10000} max={500000} step={5000} className="py-2" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Monthly Savings</label>
            <span className="font-display text-lg font-bold text-accent">{fmt(savings[0])}</span>
          </div>
          <Slider value={savings} onValueChange={setSavings} min={1000} max={200000} step={1000} className="py-2" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <label className="text-sm font-medium text-foreground">Investment Goal</label>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGoal(g)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedGoal === g
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Time Horizon</label>
            <span className="font-display text-lg font-bold text-foreground">{horizon[0]} years</span>
          </div>
          <Slider value={horizon} onValueChange={setHorizon} min={1} max={30} step={1} className="py-2" />
        </motion.div>
      </div>

      <Button
        onClick={() => navigate("/home")}
        className="mt-8 w-full rounded-2xl py-6 text-base font-semibold"
      >
        Start Investing <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default FinancialSetup;
