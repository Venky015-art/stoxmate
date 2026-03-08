import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DISPLAY_NAMES: Record<string, string> = {
  "^NSEI": "NIFTY 50",
  "^BSESN": "SENSEX",
  "^NSEBANK": "BANK NIFTY",
  "RELIANCE.NS": "Reliance Industries",
  "TCS.NS": "TCS",
  "HDFCBANK.NS": "HDFC Bank",
  "INFY.NS": "Infosys",
  "ICICIBANK.NS": "ICICI Bank",
  "HINDUNILVR.NS": "Hindustan Unilever",
  "ITC.NS": "ITC",
  "SBIN.NS": "SBI",
  "BHARTIARTL.NS": "Bharti Airtel",
  "KOTAKBANK.NS": "Kotak Mahindra Bank",
  "LT.NS": "Larsen & Toubro",
  "AXISBANK.NS": "Axis Bank",
  "WIPRO.NS": "Wipro",
  "BAJFINANCE.NS": "Bajaj Finance",
  "TATAMOTORS.NS": "Tata Motors",
  "MARUTI.NS": "Maruti Suzuki",
  "SUNPHARMA.NS": "Sun Pharma",
  "TITAN.NS": "Titan Company",
  "ULTRACEMCO.NS": "UltraTech Cement",
  "NESTLEIND.NS": "Nestle India",
  "BAJAJFINSV.NS": "Bajaj Finserv",
  "TECHM.NS": "Tech Mahindra",
  "HCLTECH.NS": "HCL Technologies",
  "ADANIENT.NS": "Adani Enterprises",
  "ADANIPORTS.NS": "Adani Ports",
  "POWERGRID.NS": "Power Grid Corp",
  "NTPC.NS": "NTPC",
  "ONGC.NS": "ONGC",
  "JSWSTEEL.NS": "JSW Steel",
  "TATASTEEL.NS": "Tata Steel",
  "COALINDIA.NS": "Coal India",
  "DRREDDY.NS": "Dr Reddy's Labs",
  "CIPLA.NS": "Cipla",
  "APOLLOHOSP.NS": "Apollo Hospitals",
  "EICHERMOT.NS": "Eicher Motors",
  "DIVISLAB.NS": "Divi's Laboratories",
  "BRITANNIA.NS": "Britannia Industries",
  "ASIANPAINT.NS": "Asian Paints",
  "HEROMOTOCO.NS": "Hero MotoCorp",
  "INDUSINDBK.NS": "IndusInd Bank",
  "GRASIM.NS": "Grasim Industries",
  "M&M.NS": "Mahindra & Mahindra",
  "BPCL.NS": "BPCL",
  "TATACONSUM.NS": "Tata Consumer",
  "HINDALCO.NS": "Hindalco Industries",
  "SBILIFE.NS": "SBI Life Insurance",
  "HDFCLIFE.NS": "HDFC Life Insurance",
  "NIFTYBEES.NS": "Nifty 50 ETF",
  "BANKBEES.NS": "Bank Nifty ETF",
  "GOLDBEES.NS": "Gold ETF",
  "ITBEES.NS": "IT ETF",
  "JUNIORBEES.NS": "Junior Nifty ETF",
};

const INDEX_SYMBOLS = ["^NSEI", "^BSESN", "^NSEBANK"];
const ETF_SYMBOLS = ["NIFTYBEES.NS", "BANKBEES.NS", "GOLDBEES.NS", "ITBEES.NS", "JUNIORBEES.NS"];

async function fetchChartData(symbol: string, range = "5d", interval = "1d") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    console.error(`Chart API error for ${symbol}: ${response.status}`);
    return null;
  }

  const data = await response.json();
  return data.chart?.result?.[0] || null;
}

function extractQuoteFromChart(symbol: string, chartResult: any) {
  const meta = chartResult.meta;
  const price = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose || meta.previousClose;
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol,
    name: DISPLAY_NAMES[symbol] || meta.shortName || symbol.replace(".NS", ""),
    price: Math.round(price * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    previousClose,
    currency: meta.currency || "INR",
    type: INDEX_SYMBOLS.includes(symbol) ? "index" : ETF_SYMBOLS.includes(symbol) ? "etf" : "stock",
  };
}

function extractHistoryFromChart(chartResult: any) {
  const timestamps = chartResult.timestamp || [];
  const closes = chartResult.indicators?.quote?.[0]?.close || [];
  
  return timestamps.map((t: number, i: number) => ({
    time: t * 1000,
    close: closes[i] != null ? Math.round(closes[i] * 100) / 100 : null,
  })).filter((p: any) => p.close !== null);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symbols, range, interval } = await req.json();

    if (type === "chart" && symbols?.length === 1) {
      const chartResult = await fetchChartData(symbols[0], range || "1mo", interval || "1d");
      if (!chartResult) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch chart data" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const history = extractHistoryFromChart(chartResult);
      const quote = extractQuoteFromChart(symbols[0], chartResult);
      return new Response(JSON.stringify({ success: true, data: { quote, history } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch quotes for multiple symbols using chart API
    const symbolList = symbols || [
      "^NSEI", "^BSESN", "^NSEBANK",
      "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
      "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "WIPRO.NS", "TATAMOTORS.NS",
      "NIFTYBEES.NS", "GOLDBEES.NS", "ITBEES.NS",
    ];

    const results = await Promise.allSettled(
      symbolList.map((s: string) => fetchChartData(s, "5d", "1d"))
    );

    const quotes = results
      .map((r, i) => {
        if (r.status === "fulfilled" && r.value) {
          return extractQuoteFromChart(symbolList[i], r.value);
        }
        return null;
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ success: true, data: quotes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-data error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
