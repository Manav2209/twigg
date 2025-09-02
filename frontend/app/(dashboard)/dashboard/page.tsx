"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart as PieChartIcon, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { PortfolioResponse, PerformanceResponse, apiClient } from "@/lib/api";



const PIE_COLORS = ["#0ea5e9", "#ef4444"]; // stocks, mutual funds

function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { 
      style: "currency", 
      currency: "USD", 
      maximumFractionDigits: 0 
    }).format(n);
  } catch {
    return n.toLocaleString();
  }
}



export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch portfolio data
  const fetchPortfolioData = useCallback(async () => {
    try {
      setError(null);
      const [portfolioData, performanceData] = await Promise.all([
        apiClient.getPortfolio(),
        apiClient.getPerformance()
      ]);
      
      setPortfolio(portfolioData);
      setPerformance(performanceData);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPortfolioData();
  };

  // Auto-refresh every 30 seconds (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchPortfolioData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, refreshing, fetchPortfolioData]);

  // Derived data for charts
  const allocationData = useMemo(() => {
    if (!performance) return [];
    
    return [
      { name: "Stocks", value: performance.allocation.stocks.value },
      { name: "Mutual Funds", value: performance.allocation.mutualFunds.value },
    ];
  }, [performance]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f9ff] via-[#93c5fd] to-[#f0f9ff] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading portfolio data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f9ff] via-[#93c5fd] to-[#f0f9ff] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-96">
            <Card className="p-6 max-w-md">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <span className="font-semibold">Error loading portfolio</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} className="w-full">
                Try Again
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio || !performance) {
    return null;
  }

  const { summary, stocks, mutualFunds } = portfolio;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f9ff] via-[#93c5fd] to-[#f0f9ff] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Portfolio Dashboard</h1>
            <p className="text-sm opacity-80">Live data from API - Stocks & Mutual Funds</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Total Current Value</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(summary.currentValue)}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Total Invested</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(summary.totalInvestment)}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.totalGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(summary.totalGainLoss)}
              </div>
              <div className={`text-sm ${summary.totalGainLoss >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {summary.totalGainLossPercentage.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChartIcon className="h-4 w-4" /> Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-6">
                <div className="flex items-center justify-between">
                  <span>Stocks</span>
                  <span className="font-medium">
                    {performance.allocation.stocks.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mutual Funds</span>
                  <span className="font-medium">
                    {performance.allocation.mutualFunds.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocation Pie + Top Performers */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1 shadow-md">
            <CardHeader>
              <CardTitle>Stocks vs Mutual Funds</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocationData} dataKey="value" nameKey="name" outerRadius={100} label>
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Top Performing Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b">
                    <tr className="text-xs uppercase tracking-wide">
                      <th className="py-2">Symbol</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Current Value</th>
                      <th className="py-2">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.topPerformers.map((performer) => (
                      <tr key={`${performer.symbol}-${performer.type}`} className="border-b/50">
                        <td className="py-3 font-medium">{performer.symbol}</td>
                        <td className="py-3 capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            performer.type === 'stock' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {performer.type === 'mutual_fund' ? 'Fund' : 'Stock'}
                          </span>
                        </td>
                        <td className="py-3">{formatCurrency(performer.totalValue)}</td>
                        <td className={`py-3 font-medium ${
                          performer.gainLossPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {performer.gainLossPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings tables */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Stocks Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b">
                    <tr className="text-xs uppercase tracking-wide">
                      <th className="py-2">Symbol</th>
                      <th className="py-2">Shares</th>
                      <th className="py-2">Avg Buy</th>
                      <th className="py-2">Current</th>
                      <th className="py-2">Value</th>
                      <th className="py-2">P&L</th>
                      <th className="py-2">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock.id} className="border-b/50">
                        <td className="py-3 font-medium">{stock.symbol}</td>
                        <td className="py-3">{stock.shares}</td>
                        <td className="py-3">{formatCurrency(stock.purchasePrice)}</td>
                        <td className="py-3">{formatCurrency(stock.currentPrice)}</td>
                        <td className="py-3">{formatCurrency(stock.totalValue)}</td>
                        <td className={`py-3 font-medium ${
                          stock.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {formatCurrency(stock.gainLoss)}
                        </td>
                        <td className={`py-3 font-medium ${
                          stock.gainLossPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {stock.gainLossPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Mutual Funds Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b">
                    <tr className="text-xs uppercase tracking-wide">
                      <th className="py-2">Fund</th>
                      <th className="py-2">Units</th>
                      <th className="py-2">Buy NAV</th>
                      <th className="py-2">Current NAV</th>
                      <th className="py-2">Value</th>
                      <th className="py-2">P&L</th>
                      <th className="py-2">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mutualFunds.map((fund) => (
                      <tr key={fund.id} className="border-b/50">
                        <td className="py-3 font-medium">{fund.symbol}</td>
                        <td className="py-3">{fund.units}</td>
                        <td className="py-3">{formatCurrency(fund.nav)}</td>
                        <td className="py-3">{formatCurrency(fund.currentPrice)}</td>
                        <td className="py-3">{formatCurrency(fund.totalValue)}</td>
                        <td className={`py-3 font-medium ${
                          fund.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {formatCurrency(fund.gainLoss)}
                        </td>
                        <td className={`py-3 font-medium ${
                          fund.gainLossPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {fund.gainLossPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Performance Insights */}
        {performance.worstPerformers.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> 
                Holdings to Watch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b">
                    <tr className="text-xs uppercase tracking-wide">
                      <th className="py-2">Symbol</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Current Value</th>
                      <th className="py-2">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.worstPerformers.map((performer) => (
                      <tr key={`${performer.symbol}-${performer.type}`} className="border-b/50">
                        <td className="py-3 font-medium">{performer.symbol}</td>
                        <td className="py-3 capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            performer.type === 'stock' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {performer.type === 'mutual_fund' ? 'Fund' : 'Stock'}
                          </span>
                        </td>
                        <td className="py-3">{formatCurrency(performer.totalValue)}</td>
                        <td className={`py-3 font-medium ${
                          performer.gainLossPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {performer.gainLossPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}