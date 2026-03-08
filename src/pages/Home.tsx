import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Sparkles, Bell, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const chartData = [
  { v: 24 }, { v: 28 }, { v: 26 }, { v: 32 }, { v: 30 }, { v: 38 }, { v: 35 }, { v: 42 }, { v: 40 }, { v: 48 }, { v: 45 }, { v: 52 },
];

const marketData = [
  { name: "NIFTY 50", value: "22,456.80", change: "+1.24%", up: true },
  { name: "SENSEX", value: "73,876.44", change: "+0.98%", up: true },
  { name: "BANK NIFTY", value: "48,234.15", change: "-0.32%", up: false },
];

const suggestions = [
  { title: "Start a SIP in Nifty 50 Index Fund", desc: "Low risk • ₹500/month", tag: "Recommended" },
  { title: "Diversify with a Flexi-Cap Fund", desc: "Medium risk • High growth", tag: "AI Pick" },
  { title: "Add Gold ETF to your portfolio", desc: "Hedge against inflation", tag: "New" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-5 pb-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good morning 👋</p>
          <h1 className="font-display text-xl font-bold text-foreground">Investor</h1>
        </div>
        <button
          onClick={() => navigate("/notifications")}
          className="relative rounded-xl bg-secondary p-2.5"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
      </div>

      {/* Portfolio Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary overflow-hidden rounded-2xl p-5 shadow-card"
      >
        <p className="text-sm text-primary-foreground/70">Total Portfolio Value</p>
        <h2 className="font-display text-3xl font-bold text-primary-foreground">₹1,24,850</h2>
        <div className="mt-1 flex items-center gap-1">
          <ArrowUpRight className="h-4 w-4 text-green-300" />
          <span className="text-sm font-medium text-green-300">+12.4% all time</span>
        </div>
        <div className="mt-3 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Market Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">Today's Market</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {marketData.map((m) => (
            <div key={m.name} className="min-w-[140px] rounded-2xl border border-border bg-card p-3.5 shadow-card">
              <p className="text-xs text-muted-foreground">{m.name}</p>
              <p className="mt-1 font-display text-sm font-bold text-foreground">{m.value}</p>
              <div className={`mt-1 flex items-center gap-0.5 text-xs font-medium ${m.up ? "text-success" : "text-destructive"}`}>
                {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {m.change}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h3 className="font-display text-base font-semibold text-foreground">AI Suggestions</h3>
        </div>
        <div className="space-y-3">
          {suggestions.map((s) => (
            <button
              key={s.title}
              onClick={() => navigate("/ai-advisor")}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <span className="rounded-lg bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
                  {s.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goal Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">Goal Progress</h3>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Emergency Fund</h4>
                <p className="text-xs text-muted-foreground">₹1.24L of ₹3L</p>
              </div>
            </div>
            <span className="font-display text-sm font-bold text-primary">41%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[41%] rounded-full bg-primary transition-all" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
