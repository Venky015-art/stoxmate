import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FundDetail {
  code: number;
  name: string;
  category: string;
  risk: string;
  amc: string;
  nav: number;
  returns1M: number | null;
  returns3M: number | null;
  returns1Y: number | null;
  navHistory: { nav: number }[];
  schemeType: string;
}

const formatNav = (v: number) => "₹" + v.toFixed(2);

const MutualFundDetail = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [fund, setFund] = useState<FundDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      try {
        const { data: result } = await supabase.functions.invoke("mutual-funds", {
          body: { codes: [parseInt(code || "0")] },
        });
        if (result?.success && result.data?.length > 0) {
          setFund(result.data[0]);
        }
      } catch (e) {
        console.error("Failed to fetch fund:", e);
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchFund();
  }, [code]);

  const bestReturn = fund?.returns1Y ?? fund?.returns3M ?? fund?.returns1M ?? 0;
  const isUp = bestReturn >= 0;
  const chartColor = isUp ? "hsl(var(--success))" : "hsl(var(--destructive))";

  // Compute stats from history
  const navs = fund?.navHistory.map((p) => p.nav) ?? [];
  const allTimeHigh = navs.length ? Math.max(...navs) : 0;
  const allTimeLow = navs.length ? Math.min(...navs) : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-5 pb-3 pt-6 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl bg-secondary p-2">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          {loading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <div className="flex-1 min-w-0">
              <h1 className="truncate font-display text-lg font-bold text-foreground">{fund?.name}</h1>
              <p className="text-xs text-muted-foreground">{fund?.category} • {fund?.amc}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-5 pt-5">
        {/* NAV */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          ) : fund ? (
            <div>
              <p className="text-xs text-muted-foreground">Current NAV</p>
              <h2 className="font-display text-4xl font-bold text-foreground">{formatNav(fund.nav)}</h2>
              {fund.returns1Y !== null && (
                <div className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${fund.returns1Y >= 0 ? "text-success" : "text-destructive"}`}>
                  {fund.returns1Y >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {fund.returns1Y >= 0 ? "+" : ""}{fund.returns1Y.toFixed(2)}% (1Y return)
                </div>
              )}
            </div>
          ) : null}
        </motion.div>

        {/* NAV Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-foreground">NAV History</h3>
            <div className="h-56">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-1 w-16 animate-pulse-soft rounded-full bg-primary/30" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fund?.navHistory || []}>
                    <defs>
                      <linearGradient id="mfDetailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis hide />
                    <YAxis domain={["dataMin", "dataMax"]} hide />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [formatNav(v), "NAV"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="nav"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill="url(#mfDetailGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: chartColor }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Returns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">Returns</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "1 Month", val: fund?.returns1M },
              { label: "3 Months", val: fund?.returns3M },
              { label: "1 Year", val: fund?.returns1Y },
            ].map((r) => (
              <div key={r.label} className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-card">
                <p className="text-[11px] text-muted-foreground">{r.label}</p>
                <p className={`mt-1 font-display text-base font-bold ${
                  r.val !== null && r.val !== undefined && r.val >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {r.val !== null && r.val !== undefined
                    ? `${r.val >= 0 ? "+" : ""}${r.val.toFixed(2)}%`
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">Fund Details</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Category", value: fund?.category || "—" },
              { label: "Risk Level", value: fund?.risk || "—" },
              { label: "AMC", value: fund?.amc || "—" },
              { label: "Scheme Type", value: fund?.schemeType?.replace("Open Ended Schemes", "Open Ended") || "—" },
              { label: "All-Time High NAV", value: allTimeHigh ? formatNav(allTimeHigh) : "—" },
              { label: "All-Time Low NAV", value: allTimeLow ? formatNav(allTimeLow) : "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-3.5 shadow-card">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h4 className="text-sm font-semibold text-foreground">AI Insight</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {fund ? (
                fund.category === "Index"
                  ? `${fund.name} tracks the market index, making it ideal for beginners. With low expense ratios and broad diversification, index funds are a great starting point. Start a SIP with ₹500/month.`
                  : fund.risk === "High"
                  ? `${fund.name} is a ${fund.category.toLowerCase()} fund with higher risk but strong growth potential. Best suited for long-term investors (5+ years) who can handle market volatility.`
                  : `${fund.name} offers a balanced approach with ${fund.risk.toLowerCase()} risk. Consider adding this to your portfolio via a monthly SIP for steady wealth building.`
              ) : "Loading insights..."}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
            onClick={() => toast.success("One-time investment coming soon! 🚀")}
            className="flex-1 rounded-2xl py-6 text-base font-semibold"
          >
            Invest Now
          </Button>
        </motion.div>

        {/* Min SIP info */}
        <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Minimum SIP: <span className="font-semibold text-foreground">₹500/month</span></p>
          <p className="mt-1 text-xs text-muted-foreground">Minimum Lump Sum: <span className="font-semibold text-foreground">₹1,000</span></p>
        </div>

        {/* Disclaimer */}
        <p className="pb-4 text-center text-[10px] leading-relaxed text-muted-foreground">
          <Shield className="mr-0.5 inline h-3 w-3" />
          Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
          Past performance doesn't guarantee future results. Data sourced from MFAPI.
        </p>
      </div>
    </div>
  );
};

export default MutualFundDetail;
