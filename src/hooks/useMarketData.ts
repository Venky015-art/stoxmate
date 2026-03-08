import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  currency: string;
  type: "index" | "stock" | "etf";
}

export interface ChartPoint {
  time: number;
  close: number;
}

interface MarketDataResponse {
  success: boolean;
  data: MarketQuote[];
  error?: string;
}

interface ChartDataResponse {
  success: boolean;
  data: {
    quote: MarketQuote;
    history: ChartPoint[];
  };
  error?: string;
}

export function useMarketData(symbols?: string[]) {
  const [data, setData] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error: fnError } = await supabase.functions.invoke<MarketDataResponse>(
        "market-data",
        { body: { type: "quotes", symbols } }
      );
      if (fnError) throw fnError;
      if (result?.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(result?.error || "Failed to fetch market data");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch market data");
    } finally {
      setLoading(false);
    }
  }, [symbols?.join(",")]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useChartData(symbol: string, range = "1mo", interval = "1d") {
  const [data, setData] = useState<{ quote: MarketQuote | null; history: ChartPoint[] }>({
    quote: null,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoading(true);
        const { data: result } = await supabase.functions.invoke<ChartDataResponse>(
          "market-data",
          { body: { type: "chart", symbols: [symbol], range, interval } }
        );
        if (result?.success && result.data) {
          setData(result.data);
        }
      } catch (e) {
        console.error("Chart fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [symbol, range, interval]);

  return { ...data, loading };
}
