import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMarketData, type MarketQuote } from "@/hooks/useMarketData";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const categories = ["All", "Stocks", "ETFs"];

const riskLevel = (symbol: string): string => {
  if (symbol.includes("GOLDBEES") || symbol.includes("NIFTYBEES")) return "Low";
  if (symbol.includes("BAJFINANCE") || symbol.includes("TATAMOTORS")) return "High";
  return "Medium";
};

const riskColor: Record<string, string> = {
  Low: "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  High: "text-destructive bg-destructive/10",
};

const aiPicks = ["NIFTYBEES.NS", "GOLDBEES.NS", "HDFCBANK.NS", "INFY.NS", "TCS.NS"];

// Generate simple sparkline data from price
const sparkline = (price: number, change: number) => {
  const base = price - change;
  const steps = 10;
  return Array.from({ length: steps }, (_, i) => ({
    v: base + (change * i) / steps + (Math.random() - 0.5) * Math.abs(change) * 0.3,
  }));
};

const ALL_SYMBOLS = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
  "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "WIPRO.NS", "TATAMOTORS.NS",
  "BAJFINANCE.NS", "NIFTYBEES.NS", "GOLDBEES.NS", "ITBEES.NS",
];

const Invest = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const { data: quotes, loading, refetch } = useMarketData(ALL_SYMBOLS);

  const filtered = quotes.filter((q: MarketQuote) => {
    if (q.type === "index") return false;
    const matchCat =
      active === "All" ||
      (active === "Stocks" && q.type === "stock") ||
      (active === "ETFs" && q.type === "etf");
    const matchSearch = q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.symbol.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Invest</h1>
          <p className="text-sm text-muted-foreground">Live market data</p>
        </div>
        <button onClick={refetch} className="rounded-lg bg-secondary p-2" disabled={loading}>
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stocks, ETFs..."
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
        {loading && quotes.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            ))
          : filtered.map((q, i) => {
              const risk = riskLevel(q.symbol);
              const isAiPick = aiPicks.includes(q.symbol);
              const isUp = q.change >= 0;
              const data = sparkline(q.price, q.change);

              return (
                <motion.div
                  key={q.symbol}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-2xl border border-border bg-card p-4 shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{q.name}</h4>
                        {isAiPick && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ₹{q.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span className={`font-display text-sm font-bold ${isUp ? "text-success" : "text-destructive"}`}>
                      <span className="flex items-center gap-0.5">
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {isUp ? "+" : ""}{q.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${riskColor[risk]}`}>
                        <Shield className="mr-0.5 inline h-3 w-3" />{risk} Risk
                      </span>
                      {isAiPick && (
                        <span className="rounded-lg bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          AI Pick
                        </span>
                      )}
                    </div>
                    <div className="h-10 w-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id={`inv-g-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                            strokeWidth={1.5}
                            fill={`url(#inv-g-${i})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        {!loading && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No results found</p>
        )}
      </div>
      {quotes.length > 0 && (
        <p className="text-center text-[10px] text-muted-foreground">
          Live data from Yahoo Finance • Prices may be delayed
        </p>
      )}
    </div>
  );
};

export default Invest;
