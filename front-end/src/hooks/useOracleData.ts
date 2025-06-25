import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ethersProvider } from "../ethersProvider";
import OracleABI from "../Oracle.json";

// Use the complete ABI from Oracle.json
const ORACLE_ABI = OracleABI.abi;

// Cache interface
interface CacheEntry {
  data: OraclePrice[];
  timestamp: number;
  oracleAddress: string;
}

// In-memory cache
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30000; // 30 seconds cache TTL

export interface OraclePrice {
  symbol: string;
  price: string;
  lastUpdated: string;
  exists: boolean;
  isActive: boolean;
}

// Helper function to check if cache is valid
function isCacheValid(entry: CacheEntry, oracleAddress: string): boolean {
  const now = Date.now();
  return (
    entry.oracleAddress === oracleAddress && now - entry.timestamp < CACHE_TTL
  );
}

// Helper function to get cache key
function getCacheKey(oracleAddress: string, symbols: string[]): string {
  return `${oracleAddress}-${symbols.join(",")}`;
}

export function useOracleData(
  oracleAddress: string,
  symbols: string[] = ["BTC", "DOT", "ETH", "SOL", "USDT", "USDC"]
) {
  const [prices, setPrices] = useState<OraclePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOracleData() {
      // Early return if missing dependencies
      if (!ethersProvider || !oracleAddress) {
        setError(
          !ethersProvider
            ? "Provider not available"
            : "Oracle address not available"
        );
        setLoading(false);
        return;
      }

      const cacheKey = getCacheKey(oracleAddress, symbols);
      const cachedEntry = cache.get(cacheKey);

      // Check if we have valid cached data
      if (cachedEntry && isCacheValid(cachedEntry, oracleAddress)) {
        setPrices(cachedEntry.data);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const oracleContract = new ethers.Contract(
          oracleAddress,
          ORACLE_ABI,
          ethersProvider
        );

        // Fetch all price data in parallel
        const priceData = await Promise.all(
          symbols.map(async (symbol) => {
            try {
              const exists = await oracleContract.feedExists(symbol);

              if (!exists) {
                return {
                  symbol,
                  price: "0",
                  lastUpdated: "N/A",
                  exists: false,
                  isActive: false,
                };
              }

              const [isActive, price, lastUpdated] = await Promise.all([
                oracleContract.isActive(symbol),
                oracleContract.getPrice(symbol),
                oracleContract.getLastUpdated(symbol),
              ]);

              return {
                symbol,
                price: ethers.formatUnits(price, 8),
                lastUpdated: new Date(
                  Number(lastUpdated) * 1000
                ).toLocaleString(),
                exists,
                isActive,
              };
            } catch {
              return {
                symbol,
                price: "0",
                lastUpdated: "N/A",
                exists: false,
                isActive: false,
              };
            }
          })
        );

        // Cache the fetched data
        cache.set(cacheKey, {
          data: priceData,
          timestamp: Date.now(),
          oracleAddress,
        });

        setPrices(priceData);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch oracle data"
        );
        setLoading(false);
      }
    }

    fetchOracleData();

    // Poll every 30 seconds (cache TTL)
    const interval = setInterval(fetchOracleData, CACHE_TTL);
    return () => clearInterval(interval);
  }, [oracleAddress, symbols]);

  // Function to manually refresh data (clear cache and refetch)
  const refreshData = () => {
    const cacheKey = getCacheKey(oracleAddress, symbols);
    cache.delete(cacheKey);
    setLoading(true);
  };

  return { prices, loading, error, refreshData };
}
