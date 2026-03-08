import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const categories = ["All", "Stocks", "Mutual Funds", "ETFs"];

const investments = [
  { name: "Nifty 50 Index Fund", type: "Mutual Fund", risk: "Low", return: "+14.2%", aiRec: true, data: [20,22,21,25,24,28,27,30,32,35] },
  { name: "HDFC Bank", type: "Stock", risk: "Medium", return: "+18.7%", aiRec: false, data: [30,28,32,35,33,38,36,40,42,45] },
  { name: "Gold ETF", type: "ETF", risk: "Low", return: "+8.5%", aiRec: true, data: [15,16,15,17,18,17,19,20,21,22] },
  { name: "Axis Flexi Cap Fund", type: "Mutual Fund", risk: "High", return: "+22.1%", aiRec: true, data: [10,15,12,18,16,22,20,25,28,32] },
  { name: "Reliance Industries", type: "Stock", risk: "Medium", return: "+11.3%", aiRec: false, data: [40,42,38,44,42,46,44,48,50,52] },
  { name: "IT ETF", type: "ETF", risk: "Medium", return: "+16.8%", aiRec: false, data: [25,28,26,30,32,31,34,36,38,40] },
];

const riskColor: Record<string, string> = {
  Low: "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  High: "text-destructive bg-destructive/10",
};

const Invest = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = investments.filter((inv) => {
    const matchCat = active === "All" || inv.type.includes(active.replace("s", "").replace("Mutual Fund", "Mutual Fund"));
    const matchSearch = inv.name.toLowerCase().includes(search.toLowerCase());
    if (active === "Stocks") return inv.type === "Stock" && matchSearch;
    if (active === "Mutual Funds") return inv.type === "Mutual Fund" && matchSearch;
    if (active === "ETFs") return inv.type === "ETF" && matchSearch;
    return matchSearch;
  });

  return (
    <div className="space-y-5 px-5 pb-4 pt-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Invest</h1>
        <p className="text-sm text-muted-foreground">Explore investment opportunities</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stocks, funds, ETFs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 rounded-xl border-border pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              active === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((inv, i) => (
          <motion.div
            key={inv.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{inv.name}</h4>
                  {inv.aiRec && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground">{inv.type}</p>
              </div>
              <span className="font-display text-sm font-bold text-success">{inv.return}</span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${riskColor[inv.risk]}`}>
                  <Shield className="mr-0.5 inline h-3 w-3" />{inv.risk} Risk
                </span>
                {inv.aiRec && (
                  <span className="rounded-lg bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                    AI Pick
                  </span>
                )}
              </div>
              <div className="h-10 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={inv.data.map(v => ({ v }))}>
                    <defs>
                      <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="hsl(var(--accent))" strokeWidth={1.5} fill={`url(#g-${i})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Invest;
