import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMarketData, type MarketQuote } from "@/hooks/useMarketData";
import { useMutualFunds, type MutualFund } from "@/hooks/useMutualFunds";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryKeys = ["all", "stocks", "etfs", "mutualFunds"] as const;

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
const mfAiPicks = [122639, 118989, 120505];

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.025 }}
      onClick={() => navigate(`/stock/${encodeURIComponent(q.symbol)}`)}
      className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{q.name}</h4>
            {isAiPick && <Sparkles className="h-3 w-3 text-accent" />}
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
        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskColor[risk]}`}>
            {risk}
          </span>
          {isAiPick && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
              AI Pick
            </span>
          )}
        </div>
        <div className="h-9 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`inv-g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.2} />
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

const MFCard = ({ fund, i, navigate }: { fund: MutualFund; i: number; navigate: (path: string) => void }) => {
  const isAiPick = mfAiPicks.includes(fund.code);
  const bestReturn = fund.returns1Y ?? fund.returns3M ?? fund.returns1M ?? 0;
  const isUp = bestReturn >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.025 }}
      onClick={() => navigate(`/mutual-fund/${fund.code}`)}
      className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{fund.name}</h4>
            {isAiPick && <Sparkles className="h-3 w-3 text-accent" />}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>{fund.category}</span>
            <span className="text-border">•</span>
            <span>{fund.amc}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-sm font-bold text-foreground">₹{fund.nav.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">NAV</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {[
          { label: "1M", val: fund.returns1M },
          { label: "3M", val: fund.returns3M },
          { label: "1Y", val: fund.returns1Y },
        ].map((r) => (
          <div key={r.label} className="flex-1 rounded-xl bg-secondary/60 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">{r.label}</p>
            <p className={`text-xs font-bold ${r.val !== null && r.val >= 0 ? "text-success" : "text-destructive"}`}>
              {r.val !== null ? `${r.val >= 0 ? "+" : ""}${r.val.toFixed(1)}%` : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskColor[fund.risk]}`}>
            {fund.risk}
          </span>
          {isAiPick && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
              AI Pick
            </span>
          )}
        </div>
        <div className="h-9 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fund.navHistory}>
              <defs>
                <linearGradient id={`mf-g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.2} />
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
  const [active, setActive] = useState<typeof categoryKeys[number]>("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: quotes, loading: stocksLoading, refetch: refetchStocks } = useMarketData(ALL_SYMBOLS);
  const { data: mutualFunds, loading: mfLoading, refetch: refetchMF } = useMutualFunds();

  const catMap = { all: "All", stocks: "Stocks", etfs: "ETFs", mutualFunds: "Mutual Funds" };
  const showStocks = active === "all" || active === "stocks" || active === "etfs";
  const showMF = active === "all" || active === "mutualFunds";

  const filteredStocks = quotes.filter((q: MarketQuote) => {
    if (q.type === "index") return false;
    const matchCat =
      active === "all" ||
      (active === "stocks" && q.type === "stock") ||
      (active === "etfs" && q.type === "etf");
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
    <div className="space-y-5 px-5 pb-4 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{t("invest")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("liveMarketData")}</p>
        </div>
        <button onClick={handleRefresh} className="rounded-xl bg-secondary p-2 hover:bg-secondary/80 transition-colors" disabled={loading}>
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 rounded-xl border-border bg-secondary/50 pl-11 text-sm placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categoryKeys.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              active === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      {showStocks && (
        <div className="space-y-2.5">
          {stocksLoading && quotes.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)
            : filteredStocks.map((q, i) => (
                <StockCard key={q.symbol} q={q} i={i} navigate={navigate} />
              ))}
        </div>
      )}

      {showMF && (
        <div className="space-y-2.5">
          {(active === "all" && filteredMF.length > 0) && (
            <div className="flex items-center gap-2 pt-1">
              <TrendingUp className="h-3.5 w-3.5 text-foreground" />
              <h3 className="font-display text-sm font-semibold text-foreground">{t("mutualFunds")}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {filteredMF.length}
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
        <p className="py-12 text-center text-sm text-muted-foreground">No results found</p>
      )}

      {(quotes.length > 0 || mutualFunds.length > 0) && (
        <p className="text-center text-[10px] text-muted-foreground/50 pb-2">
          Data may be delayed up to 15 minutes
        </p>
      )}
    </div>
  );
};

export default Invest;
