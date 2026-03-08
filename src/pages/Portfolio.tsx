import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const allocation = [
  { name: "Index Funds", value: 45, color: "hsl(221, 83%, 53%)" },
  { name: "Flexi-Cap", value: 25, color: "hsl(174, 72%, 40%)" },
  { name: "Gold ETF", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Debt Funds", value: 15, color: "hsl(215, 16%, 47%)" },
];

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
  { name: "Nifty 50 Index Fund", value: "₹56,182", change: "+14.2%", up: true },
  { name: "Axis Flexi Cap Fund", value: "₹31,212", change: "+22.1%", up: true },
  { name: "Gold ETF", value: "₹18,728", change: "+8.5%", up: true },
  { name: "SBI Short Term Debt", value: "₹18,728", change: "+6.8%", up: true },
];

const Portfolio = () => (
  <div className="space-y-6 px-5 pb-4 pt-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Portfolio</h1>
      <p className="text-sm text-muted-foreground">Your investment overview</p>
    </div>

    {/* Value Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <p className="text-sm text-muted-foreground">Total Value</p>
      <h2 className="font-display text-3xl font-bold text-foreground">₹1,24,850</h2>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-success">+₹13,850 (12.4%)</span>
        <span className="text-muted-foreground">invested ₹1,11,000</span>
      </div>
    </motion.div>

    {/* Growth Chart */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <h3 className="mb-3 font-display text-base font-semibold text-foreground">Growth</h3>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>

    {/* Allocation */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h3 className="mb-3 font-display text-base font-semibold text-foreground">Allocation</h3>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {allocation.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-xs text-foreground">{a.name}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Holdings */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <h3 className="mb-3 font-display text-base font-semibold text-foreground">Holdings</h3>
      <div className="space-y-2">
        {holdings.map((h) => (
          <div key={h.name} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{h.name}</h4>
              <p className="text-xs text-muted-foreground">{h.value}</p>
            </div>
            <span className="text-sm font-semibold text-success">{h.change}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default Portfolio;
