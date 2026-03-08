import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Indian market symbols
const SYMBOLS: Record<string, string[]> = {
  indices: ["^NSEI", "^BSESN", "^NSEBANK"],
  stocks: [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
    "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
    "LT.NS", "AXISBANK.NS", "WIPRO.NS", "BAJFINANCE.NS", "TATAMOTORS.NS",
  ],
  etfs: [
    "NIFTYBEES.NS", "BANKBEES.NS", "GOLDBEES.NS", "ITBEES.NS", "JUNIORBEES.NS",
  ],
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
  "NIFTYBEES.NS": "Nifty 50 ETF",
  "BANKBEES.NS": "Bank Nifty ETF",
  "GOLDBEES.NS": "Gold ETF",
  "ITBEES.NS": "IT ETF",
  "JUNIORBEES.NS": "Junior Nifty ETF",
};

async function fetchQuotes(symbols: string[]) {
  const joined = symbols.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(joined)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    console.error("Yahoo Finance API error:", response.status);
    throw new Error(`Yahoo API returned ${response.status}`);
  }

  const data = await response.json();
  return data.quoteResponse?.result || [];
}

async function fetchChart(symbol: string, range = "1mo", interval = "1d") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!result) return null;

  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];

  return timestamps.map((t: number, i: number) => ({
    time: t * 1000,
    close: closes[i] ?? null,
  })).filter((p: { close: number | null }) => p.close !== null);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symbols: customSymbols, range, interval } = await req.json();

    if (type === "chart" && customSymbols?.length === 1) {
      const chartData = await fetchChart(customSymbols[0], range || "1mo", interval || "1d");
      return new Response(JSON.stringify({ success: true, data: chartData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: fetch quotes
    const symbolList = customSymbols || [
      ...SYMBOLS.indices,
      ...SYMBOLS.stocks.slice(0, 10),
      ...SYMBOLS.etfs,
    ];

    const quotes = await fetchQuotes(symbolList);

    const formatted = quotes.map((q: any) => ({
      symbol: q.symbol,
      name: DISPLAY_NAMES[q.symbol] || q.shortName || q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      previousClose: q.regularMarketPreviousClose,
      dayHigh: q.regularMarketDayHigh,
      dayLow: q.regularMarketDayLow,
      volume: q.regularMarketVolume,
      marketCap: q.marketCap,
      currency: q.currency || "INR",
      type: SYMBOLS.indices.includes(q.symbol)
        ? "index"
        : SYMBOLS.etfs.includes(q.symbol)
        ? "etf"
        : "stock",
    }));

    return new Response(JSON.stringify({ success: true, data: formatted }), {
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
