import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Top Indian mutual fund scheme codes (AMFI codes)
const TOP_FUNDS: {
  code: number;
  name: string;
  category: string;
  risk: string;
  amc: string;
}[] = [
  { code: 120505, name: "Axis Bluechip Fund", category: "Large Cap", risk: "Medium", amc: "Axis" },
  { code: 119551, name: "Mirae Asset Large Cap Fund", category: "Large Cap", risk: "Medium", amc: "Mirae" },
  { code: 120503, name: "SBI Bluechip Fund", category: "Large Cap", risk: "Medium", amc: "SBI" },
  { code: 118989, name: "Parag Parikh Flexi Cap Fund", category: "Flexi Cap", risk: "Medium", amc: "PPFAS" },
  { code: 122639, name: "UTI Nifty 50 Index Fund", category: "Index", risk: "Low", amc: "UTI" },
  { code: 120716, name: "HDFC Index Fund - Nifty 50", category: "Index", risk: "Low", amc: "HDFC" },
  { code: 135781, name: "Nippon India Small Cap Fund", category: "Small Cap", risk: "High", amc: "Nippon" },
  { code: 125354, name: "Axis Midcap Fund", category: "Mid Cap", risk: "High", amc: "Axis" },
  { code: 119028, name: "ICICI Pru Balanced Advantage", category: "Hybrid", risk: "Low", amc: "ICICI" },
  { code: 119062, name: "HDFC Balanced Advantage Fund", category: "Hybrid", risk: "Low", amc: "HDFC" },
  { code: 119364, name: "SBI Small Cap Fund", category: "Small Cap", risk: "High", amc: "SBI" },
  { code: 120587, name: "Kotak Emerging Equity Fund", category: "Mid Cap", risk: "High", amc: "Kotak" },
];

async function fetchFundData(code: number) {
  const url = `https://api.mfapi.in/mf/${code}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  return data;
}

function computeReturns(navData: { date: string; nav: string }[]) {
  if (!navData || navData.length < 2) return { nav: 0, returns1M: 0, returns3M: 0, returns1Y: 0, navHistory: [] };

  const current = parseFloat(navData[0].nav);
  const today = new Date(navData[0].date.split("-").reverse().join("-"));

  // Find NAV closest to target dates
  const findNavAt = (daysAgo: number) => {
    const target = new Date(today);
    target.setDate(target.getDate() - daysAgo);
    // Find the closest entry
    for (const entry of navData) {
      const d = new Date(entry.date.split("-").reverse().join("-"));
      if (d <= target) return parseFloat(entry.nav);
    }
    return null;
  };

  const nav1M = findNavAt(30);
  const nav3M = findNavAt(90);
  const nav1Y = findNavAt(365);

  const calcReturn = (old: number | null) => (old && old > 0 ? ((current - old) / old) * 100 : null);

  // Build compact nav history (last 30 data points for sparkline)
  const step = Math.max(1, Math.floor(navData.length / 30));
  const navHistory = navData
    .filter((_, i) => i % step === 0)
    .slice(0, 30)
    .reverse()
    .map((d) => ({ nav: parseFloat(d.nav) }));

  return {
    nav: current,
    returns1M: calcReturn(nav1M),
    returns3M: calcReturn(nav3M),
    returns1Y: calcReturn(nav1Y),
    navHistory,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { codes } = body as { codes?: number[] };

    const fundsToFetch = codes
      ? TOP_FUNDS.filter((f) => codes.includes(f.code))
      : TOP_FUNDS;

    const results = await Promise.allSettled(
      fundsToFetch.map(async (fund) => {
        const data = await fetchFundData(fund.code);
        if (!data || !data.data) return null;

        const { nav, returns1M, returns3M, returns1Y, navHistory } = computeReturns(data.data);

        return {
          code: fund.code,
          name: fund.name,
          category: fund.category,
          risk: fund.risk,
          amc: fund.amc,
          nav,
          returns1M,
          returns3M,
          returns1Y,
          navHistory,
          schemeType: data.meta?.scheme_type || "",
        };
      })
    );

    const funds = results
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean);

    return new Response(JSON.stringify({ success: true, data: funds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mutual-funds error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
