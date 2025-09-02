"use client";

import { useWebSocketData } from "@/hooks/useWebSocket";
import { useEffect, useState, useMemo } from "react";

type SortKey = "symbol" | "fund" | "currentPrice" | "change" | "changePercent";
type SortOrder = "asc" | "desc";

export default function FundsPage() {
  const { funds, connected } = useWebSocketData();
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sorting logic
  const sortedFunds = useMemo(() => {
    return [...funds].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [funds, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 opacity-0 animate-[fadeInUp_0.7s_ease-out_forwards]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Mutual Funds
                </h1>
                <p className="text-slate-600 text-lg mt-1">
                  Real-time NAV tracking and performance
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-slate-200">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-red-500"
                } animate-pulse`}
              />
              <span
                className={`text-sm font-medium ${
                  connected ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {connected ? "Live Data" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Total Funds
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {funds.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Gainers</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {funds.filter((f) => f.change > 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Decliners
                  </p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    {funds.filter((f) => f.change < 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table with Sorting */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Fund Performance
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Auto-refresh every 10s
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 hover:bg-slate-50/80">
                  {[
                    { key: "symbol", label: "Symbol" },
                    { key: "fund", label: "Fund Name" },
                    { key: "currentPrice", label: "NAV (₹)" },
                    { key: "change", label: "Change" },
                    { key: "changePercent", label: "% Change" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as SortKey)}
                      className="text-left font-semibold text-slate-700 py-4 px-6 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedFunds.map((fund, i) => (
                  <tr
                    key={fund.symbol}
                    className="hover:bg-slate-50/50 transition-colors duration-200 border-b border-slate-100 opacity-0 animate-[slideInLeft_0.4s_ease-out_forwards]"
                    style={{ animationDelay: `${i * 0.03 + 0.4}s` }}
                  >
                    <td className="font-bold text-slate-900 py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {fund.symbol.slice(0, 2)}
                        </div>
                        {fund.symbol}
                      </div>
                    </td>
                    <td className="text-slate-700 font-medium px-6">
                      <div className="max-w-xs truncate" title={fund.fund}>
                        {fund.fund}
                      </div>
                    </td>
                    <td className="text-right font-bold text-slate-900 text-lg px-6">
                      ₹{fund.currentPrice.toFixed(2)}
                    </td>
                    <td className="text-right font-semibold px-6">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          fund.change >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {fund.change >= 0 ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 11l5-5m0 0l5 5m-5-5v12"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                          </svg>
                        )}
                        {fund.change >= 0 ? `+${fund.change}` : fund.change}
                      </div>
                    </td>
                    <td className="text-right font-bold px-6">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                          fund.changePercent >= 0
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {fund.changePercent >= 0 ? "+" : ""}
                        {fund.changePercent}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
          Data refreshed in real-time • Last updated: {currentTime}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
