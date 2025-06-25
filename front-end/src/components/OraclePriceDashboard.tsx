import { useOracleData } from "../hooks/useOracleData";
import { OraclePriceCard } from "./OraclePriceCard";

interface OraclePriceDashboardProps {
  oracleAddress: string;
}

export function OraclePriceDashboard({
  oracleAddress,
}: OraclePriceDashboardProps) {
  const { prices, loading, error, refreshData } = useOracleData(oracleAddress);

  // Show loading state as default
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading oracle data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading oracle data
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
            <button
              onClick={refreshData}
              className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:text-red-200 dark:bg-red-800 dark:hover:bg-red-700"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeFeeds = prices.filter((price) => price.exists && price.isActive);
  const inactiveFeeds = prices.filter(
    (price) => !price.exists || !price.isActive
  );

  // Function to get optimal grid columns based on number of items
  const getGridColumns = (itemCount: number) => {
    if (itemCount <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (itemCount <= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (itemCount <= 6)
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
    if (itemCount <= 8)
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Oracle Price Dashboard
        </h1>
        <button
          onClick={refreshData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Active Feeds */}
      {activeFeeds.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Active Price Feeds ({activeFeeds.length})
          </h2>
          <div className={`grid ${getGridColumns(activeFeeds.length)} gap-4`}>
            {activeFeeds.map((priceData) => (
              <OraclePriceCard key={priceData.symbol} priceData={priceData} />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Feeds */}
      {inactiveFeeds.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Inactive Feeds ({inactiveFeeds.length})
          </h2>
          <div className={`grid ${getGridColumns(inactiveFeeds.length)} gap-4`}>
            {inactiveFeeds.map((priceData) => (
              <OraclePriceCard key={priceData.symbol} priceData={priceData} />
            ))}
          </div>
        </div>
      )}

      {/* No feeds available - only show after successful fetch with no data */}
      {!loading && prices.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No price feeds available. Please check the oracle contract
            configuration.
          </div>
          <button
            onClick={refreshData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
