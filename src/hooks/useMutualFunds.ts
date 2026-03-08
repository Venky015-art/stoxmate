import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MutualFund {
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

export function useMutualFunds() {
  const [data, setData] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error: fnError } = await supabase.functions.invoke("mutual-funds", {
        body: {},
      });
      if (fnError) throw fnError;
      if (result?.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(result?.error || "Failed to fetch mutual fund data");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch mutual fund data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
