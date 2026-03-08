import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, Brain, Layers, ArrowRight } from "lucide-react";

const slides = [
  {
    icon: BarChart3,
    title: "Understand your money",
    description: "Get a clear picture of your income, expenses, and savings potential with smart analytics.",
  },
  {
    icon: Brain,
    title: "AI-powered investing",
    description: "Our AI assistant analyzes markets and recommends investments tailored to your goals.",
  },
  {
    icon: Layers,
    title: "Build wealth step by step",
    description: "Start small and grow your portfolio gradually with guided, diversified investments.",
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (step < 2) setStep(step + 1);
    else navigate("/auth");
  };

  return (
    <div className="flex min-h-screen flex-col justify-between px-6 py-12">
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/auth")}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col items-center justify-center gap-10 text-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary">
            {(() => {
              const Icon = slides[step].icon;
              return <Icon className="h-11 w-11 text-foreground" strokeWidth={1.5} />;
            })()}
          </div>
          <div className="space-y-3 max-w-sm">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {slides[step].title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {slides[step].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-foreground" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <Button onClick={next} className="w-full rounded-2xl py-6 text-sm font-semibold tracking-wide">
          {step < 2 ? "Continue" : (
            <span className="flex items-center gap-2">Get Started <ArrowRight className="h-4 w-4" /></span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
