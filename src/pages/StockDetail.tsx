import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, Shield, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChartData } from "@/hooks/useMarketData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const RANGES = [
  { label: "1D", range: "1d", interval: "5m" },
  { label: "1W", range: "5d", interval: "15m" },
  { label: "1M", range: "1mo", interval: "1d" },
  { label: "3M", range: "3mo", interval: "1d" },
  { label: "1Y", range: "1y", interval: "1wk" },
];

const formatPrice = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const formatChartTime = (time: number, rangeLabel: string) => {
  const d = new Date(time);
  if (rangeLabel === "1D") return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (rangeLabel === "1W") return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const formatVolume = (v: number | undefined) => {
  if (!v) return "N/A";
  if (v >= 10000000) return (v / 10000000).toFixed(2) + " Cr";
  if (v >= 100000) return (v / 100000).toFixed(2) + " L";
  if (v >= 1000) return (v / 1000).toFixed(1) + " K";
  return v.toString();
};

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState(2); // default 1M

  const decodedSymbol = decodeURIComponent(symbol || "");
  const { quote, history, loading } = useChartData(
    decodedSymbol,
    RANGES[activeRange].range,
    RANGES[activeRange].interval
  );

  const isUp = (quote?.change ?? 0) >= 0;
  const chartColor = isUp ? "hsl(var(--success))" : "hsl(var(--destructive))";

  // Compute stats from history
  const closes = history.map((p) => p.close);
  const high = closes.length ? Math.max(...closes) : 0;
  const low = closes.length ? Math.min(...closes) : 0;
  const open = closes.length ? closes[0] : 0;
  const rangeReturn = closes.length > 1
    ? ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-5 pb-3 pt-6 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl bg-secondary p-2">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          {loading && !quote ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <div className="flex-1">
              <h1 className="font-display text-lg font-bold text-foreground">{quote?.name}</h1>
              <p className="text-xs text-muted-foreground">{decodedSymbol}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-5 pt-5">
        {/* Price */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {loading && !quote ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          ) : quote ? (
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground">
                {formatPrice(quote.price)}
              </h2>
              <div className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${isUp ? "text-success" : "text-destructive"}`}>
                {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {isUp ? "+" : ""}{quote.change.toFixed(2)} ({isUp ? "+" : ""}{quote.changePercent.toFixed(2)}%)
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            {/* Range Toggles */}
            <div className="mb-4 flex gap-1.5">
              {RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setActiveRange(i)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                    activeRange === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="h-56">
              {loading && history.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-1 w-16 animate-pulse-soft rounded-full bg-primary/30" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tickFormatter={(t) => formatChartTime(t, RANGES[activeRange].label)}
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      domain={["dataMin", "dataMax"]}
                      hide
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: 12,
                      }}
                      labelFormatter={(t) => new Date(t).toLocaleString("en-IN")}
                      formatter={(v: number) => [formatPrice(v), "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill="url(#detailGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: chartColor }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">Key Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Open", value: formatPrice(open) },
              { label: "Prev. Close", value: quote ? formatPrice(quote.previousClose) : "—" },
              { label: `${RANGES[activeRange].label} High`, value: formatPrice(high) },
              { label: `${RANGES[activeRange].label} Low`, value: formatPrice(low) },
              {
                label: `${RANGES[activeRange].label} Return`,
                value: `${rangeReturn >= 0 ? "+" : ""}${rangeReturn.toFixed(2)}%`,
                isReturn: true,
              },
              {
                label: "Type",
                value: quote?.type === "etf" ? "ETF" : quote?.type === "index" ? "Index" : "Stock",
              },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-3.5 shadow-card">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p
                  className={`mt-1 font-display text-sm font-bold ${
                    "isReturn" in s && s.isReturn
                      ? rangeReturn >= 0
                        ? "text-success"
                        : "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h4 className="text-sm font-semibold text-foreground">AI Insight</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {quote && isUp
                ? `${quote.name} is showing positive momentum with a ${quote.changePercent.toFixed(1)}% gain. Consider adding to your portfolio via SIP for long-term wealth building.`
                : quote
                ? `${quote.name} dipped ${Math.abs(quote.changePercent).toFixed(1)}% today. This could be a buying opportunity for long-term investors. Consider starting a small SIP.`
                : "Loading insights..."}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            onClick={() => toast.success("SIP setup coming soon! 🚀")}
            className="flex-1 rounded-2xl border-primary/30 py-6 text-base font-semibold text-primary hover:bg-primary/5"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Start SIP
          </Button>
          <Button
            onClick={() => toast.success("Buy feature coming soon! 🚀")}
            className="flex-1 rounded-2xl py-6 text-base font-semibold"
          >
            Buy Now
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <p className="pb-4 text-center text-[10px] leading-relaxed text-muted-foreground">
          <Shield className="mr-0.5 inline h-3 w-3" />
          Investments are subject to market risks. Past performance doesn't guarantee future results.
          Data sourced from Yahoo Finance.
        </p>
      </div>
    </div>
  );
};

export default StockDetail;
