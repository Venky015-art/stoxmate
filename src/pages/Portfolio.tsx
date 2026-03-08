import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const growthData = [
  { month: "Jan", value: 80000 },
  { month: "Feb", value: 85000 },
  { month: "Mar", value: 82000 },
  { month: "Apr", value: 90000 },
  { month: "May", value: 95000 },
  { month: "Jun", value: 92000 },
  { month: "Jul", value: 100000 },
  { month: "Aug", value: 105000 },
  { month: "Sep", value: 110000 },
  { month: "Oct", value: 108000 },
  { month: "Nov", value: 118000 },
  { month: "Dec", value: 124850 },
];

const holdings = [
  { nameKey: "indexFunds" as const, fullName: "Nifty 50 Index Fund", value: "₹56,182", change: "+14.2%", up: true },
  { nameKey: "flexiCap" as const, fullName: "Axis Flexi Cap Fund", value: "₹31,212", change: "+22.1%", up: true },
  { nameKey: "goldEtf" as const, fullName: "Gold ETF", value: "₹18,728", change: "+8.5%", up: true },
  { nameKey: "debtFunds" as const, fullName: "SBI Short Term Debt", value: "₹18,728", change: "+6.8%", up: true },
];

const Portfolio = () => {
  const { t } = useLanguage();

  const allocation = [
    { name: t("indexFunds"), value: 45, color: "hsl(240, 5%, 12%)" },
    { name: t("flexiCap"), value: 25, color: "hsl(158, 64%, 52%)" },
    { name: t("goldEtf"), value: 15, color: "hsl(36, 100%, 57%)" },
    { name: t("debtFunds"), value: 15, color: "hsl(240, 4%, 70%)" },
  ];

  return (
    <div className="space-y-7 px-5 pb-4 pt-8">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{t("portfolio")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("investmentOverview")}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("totalValue")}</p>
        <h2 className="font-display text-3xl font-bold text-foreground mt-1">₹1,24,850</h2>
        <div className="flex items-center gap-3 text-sm mt-1">
          <span className="font-semibold text-success">+₹13,850 (12.4%)</span>
          <span className="text-xs text-muted-foreground">{t("invested")} ₹1,11,000</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="mb-3 font-display text-sm font-semibold tracking-tight text-foreground">{t("growth")}</h3>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="mb-3 font-display text-sm font-semibold tracking-tight text-foreground">{t("allocation")}</h3>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="h-28 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {allocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {allocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-xs text-muted-foreground">{a.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="mb-3 font-display text-sm font-semibold tracking-tight text-foreground">{t("holdings")}</h3>
        <div className="space-y-2">
          {holdings.map((h) => (
            <div key={h.fullName} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{h.fullName}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{h.value}</p>
              </div>
              <span className="text-sm font-semibold text-success">{h.change}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;
