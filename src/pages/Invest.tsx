import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMarketData, type MarketQuote } from "@/hooks/useMarketData";
import { useMutualFunds, type MutualFund } from "@/hooks/useMutualFunds";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const categories = ["All", "Stocks", "ETFs", "Mutual Funds"];

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
const mfAiPicks = [122639, 118989, 120505]; // UTI Nifty 50, PPFAS, Axis Bluechip

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

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card p-4">
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
);

// Stock/ETF card
const StockCard = ({
  q,
  i,
  navigate,
}: {
  q: MarketQuote;
  i: number;
  navigate: (path: string) => void;
}) => {
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
      onClick={() => navigate(`/stock/${encodeURIComponent(q.symbol)}`)}
      className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
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
              <Area type="monotone" dataKey="v" stroke={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} strokeWidth={1.5} fill={`url(#inv-g-${i})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

// Mutual Fund card
const MFCard = ({ fund, i, navigate }: { fund: MutualFund; i: number; navigate: (path: string) => void }) => {
  const isAiPick = mfAiPicks.includes(fund.code);
  const bestReturn = fund.returns1Y ?? fund.returns3M ?? fund.returns1M ?? 0;
  const isUp = bestReturn >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      onClick={() => navigate(`/mutual-fund/${fund.code}`)}
      className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{fund.name}</h4>
            {isAiPick && <Sparkles className="h-3.5 w-3.5 text-accent" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{fund.category}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{fund.amc}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-sm font-bold text-foreground">₹{fund.nav.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">NAV</p>
        </div>
      </div>

      {/* Returns row */}
      <div className="mt-3 flex items-center gap-3">
        {[
          { label: "1M", val: fund.returns1M },
          { label: "3M", val: fund.returns3M },
          { label: "1Y", val: fund.returns1Y },
        ].map((r) => (
          <div key={r.label} className="flex-1 rounded-xl bg-secondary p-2 text-center">
            <p className="text-[10px] text-muted-foreground">{r.label}</p>
            <p className={`text-xs font-bold ${r.val !== null && r.val >= 0 ? "text-success" : "text-destructive"}`}>
              {r.val !== null ? `${r.val >= 0 ? "+" : ""}${r.val.toFixed(1)}%` : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${riskColor[fund.risk]}`}>
            <Shield className="mr-0.5 inline h-3 w-3" />{fund.risk} Risk
          </span>
          {isAiPick && (
            <span className="rounded-lg bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
              AI Pick
            </span>
          )}
        </div>
        <div className="h-10 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fund.navHistory}>
              <defs>
                <linearGradient id={`mf-g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="nav" stroke={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} strokeWidth={1.5} fill={`url(#mf-g-${i})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

const Invest = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: quotes, loading: stocksLoading, refetch: refetchStocks } = useMarketData(ALL_SYMBOLS);
  const { data: mutualFunds, loading: mfLoading, refetch: refetchMF } = useMutualFunds();

  const showStocks = active === "All" || active === "Stocks" || active === "ETFs";
  const showMF = active === "All" || active === "Mutual Funds";

  const filteredStocks = quotes.filter((q: MarketQuote) => {
    if (q.type === "index") return false;
    const matchCat =
      active === "All" ||
      (active === "Stocks" && q.type === "stock") ||
      (active === "ETFs" && q.type === "etf");
    const matchSearch = q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.symbol.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredMF = mutualFunds.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase()) ||
    f.amc.toLowerCase().includes(search.toLowerCase())
  );

  const loading = stocksLoading || mfLoading;

  const handleRefresh = () => {
    refetchStocks();
    refetchMF();
  };

  return (
    <div className="space-y-5 px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Invest</h1>
          <p className="text-sm text-muted-foreground">Live market data</p>
        </div>
        <button onClick={handleRefresh} className="rounded-lg bg-secondary p-2" disabled={loading}>
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stocks, ETFs, mutual funds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 rounded-xl border-border pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* Stocks & ETFs */}
      {showStocks && (
        <div className="space-y-3">
          {stocksLoading && quotes.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)
            : filteredStocks.map((q, i) => (
                <StockCard key={q.symbol} q={q} i={i} navigate={navigate} />
              ))}
        </div>
      )}

      {/* Mutual Funds section */}
      {showMF && (
        <div className="space-y-3">
          {(active === "All" && filteredMF.length > 0) && (
            <div className="flex items-center gap-2 pt-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-semibold text-foreground">Mutual Funds</h3>
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {filteredMF.length} funds
              </span>
            </div>
          )}
          {mfLoading && mutualFunds.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`mf-${i}`} />)
            : filteredMF.map((fund, i) => (
                <MFCard key={fund.code} fund={fund} i={i} navigate={navigate} />
              ))}
        </div>
      )}

      {!loading && filteredStocks.length === 0 && filteredMF.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No results found</p>
      )}

      {(quotes.length > 0 || mutualFunds.length > 0) && (
        <p className="text-center text-[10px] text-muted-foreground">
          Stocks: Yahoo Finance • Mutual Funds: MFAPI • Data may be delayed
        </p>
      )}
    </div>
  );
};

export default Invest;
