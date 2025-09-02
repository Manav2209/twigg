"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart as PieChartIcon, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// ------------------------------------------------------
// Dummy Data (10 stocks, 7 mutual funds)
// ------------------------------------------------------

type Stock = {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
};

type MutualFund = {
  symbol: string;
  fund: string;
  units: number;
  nav: number; // purchase NAV
  currentPrice: number; // current NAV
};

const initialStocks: Stock[] = [
  { symbol: "AAPL", shares: 10, purchasePrice: 150, currentPrice: 195 },
  { symbol: "GOOGL", shares: 5, purchasePrice: 2500, currentPrice: 2850 },
  { symbol: "TSLA", shares: 8, purchasePrice: 800, currentPrice: 900 },
  { symbol: "MSFT", shares: 12, purchasePrice: 300, currentPrice: 340 },
  { symbol: "AMZN", shares: 7, purchasePrice: 3300, currentPrice: 3560 },
  { symbol: "META", shares: 6, purchasePrice: 250, currentPrice: 280 },
  { symbol: "NFLX", shares: 4, purchasePrice: 500, currentPrice: 610 },
  { symbol: "NVDA", shares: 3, purchasePrice: 600, currentPrice: 820 },
  { symbol: "IBM", shares: 15, purchasePrice: 120, currentPrice: 138 },
  { symbol: "ORCL", shares: 10, purchasePrice: 90, currentPrice: 110 },
];

const initialFunds: MutualFund[] = [
  { symbol: "HDFC AMC", fund: "Equity Large Cap", units: 120, nav: 8, currentPrice: 8.75 },
  { symbol: "SBI Bluechip", fund: "Large Cap", units: 200, nav: 15, currentPrice: 15.6 },
  { symbol: "ICICI Pru Tech", fund: "Sectoral - Technology", units: 150, nav: 25, currentPrice: 26.2 },
  { symbol: "Axis Small Cap", fund: "Small Cap", units: 100, nav: 60, currentPrice: 62.4 },
  { symbol: "Kotak Emerging", fund: "Mid Cap", units: 90, nav: 48, currentPrice: 50.5 },
  { symbol: "Nippon Pharma", fund: "Sectoral - Pharma", units: 70, nav: 110, currentPrice: 114 },
  { symbol: "UTI Flexi Cap", fund: "Flexi Cap", units: 130, nav: 45, currentPrice: 46.8 },
];

// Colors for the pie slices
const PIE_COLORS = ["#0ea5e9", "#ef4444"]; // stocks, mutual funds

function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return n.toLocaleString();
  }
}

export default function PortfolioDashboard() {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [funds, setFunds] = useState<MutualFund[]>(initialFunds);

  // Totals & derived metrics
  const {
    stocksInvested,
    stocksCurrent,
    fundsInvested,
    fundsCurrent,
    totalInvested,
    totalCurrent,
    totalChange,
    topStocks,
  } = useMemo(() => {
    const sInvested = stocks.reduce((sum, s) => sum + s.shares * s.purchasePrice, 0);
    const sCurrent = stocks.reduce((sum, s) => sum + s.shares * s.currentPrice, 0);

    const fInvested = funds.reduce((sum, f) => sum + f.units * f.nav, 0);
    const fCurrent = funds.reduce((sum, f) => sum + f.units * f.currentPrice, 0);

    const tInvested = sInvested + fInvested;
    const tCurrent = sCurrent + fCurrent;
    const tChange = tCurrent - tInvested;

    const top = [...stocks]
      .map((s) => ({
        symbol: s.symbol,
        pnl: s.shares * (s.currentPrice - s.purchasePrice),
        changePct: ((s.currentPrice - s.purchasePrice) / s.purchasePrice) * 100,
        currentValue: s.shares * s.currentPrice,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 5);

    return {
      stocksInvested: sInvested,
      stocksCurrent: sCurrent,
      fundsInvested: fInvested,
      fundsCurrent: fCurrent,
      totalInvested: tInvested,
      totalCurrent: tCurrent,
      totalChange: tChange,
      topStocks: top,
    };
  }, [stocks, funds]);

  const allocationData = useMemo(
    () => [
      { name: "Stocks", value: stocksCurrent },
      { name: "Mutual Funds", value: fundsCurrent },
    ],
    [stocksCurrent, fundsCurrent]
  );

  const changePct = totalInvested ? (totalChange / totalInvested) * 100 : 0;

  // Simulate a live tick by jittering current prices
  const simulateTick = () => {
    setStocks((prev) =>
      prev.map((s) => {
        const jitter = 1 + (Math.random() - 0.5) * 0.02; // ±1%
        return { ...s, currentPrice: parseFloat((s.currentPrice * jitter).toFixed(2)) };
      })
    );
    setFunds((prev) =>
      prev.map((f) => {
        const jitter = 1 + (Math.random() - 0.5) * 0.01; // ±0.5%
        return { ...f, currentPrice: parseFloat((f.currentPrice * jitter).toFixed(2)) };
      })
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f9ff] via-[#93c5fd] to-[#f0f9ff] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Portfolio Dashboard</h1>
            <p className="text-sm opacity-80">Live mock of holdings across Stocks & Mutual Funds</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={simulateTick} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Simulate live tick
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Total Current Value</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{formatCurrency(totalCurrent)}</CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Total Invested</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{formatCurrency(totalInvested)}</CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(totalChange)}
              </div>
              <div className={`text-sm ${totalChange >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{changePct.toFixed(2)}%</div>
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
                    {((stocksCurrent / (stocksCurrent + fundsCurrent || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mutual Funds</span>
                  <span className="font-medium">
                    {((fundsCurrent / (stocksCurrent + fundsCurrent || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocation Pie + Top Stocks */}
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
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Top Performing Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b">
                    <tr className="text-xs uppercase tracking-wide">
                      <th className="py-2">Symbol</th>
                      <th className="py-2">Current Value</th>
                      <th className="py-2">P&L</th>
                      <th className="py-2">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStocks.map((row) => (
                      <tr key={row.symbol} className="border-b/50">
                        <td className="py-3 font-medium">{row.symbol}</td>
                        <td className="py-3">{formatCurrency(row.currentValue)}</td>
                        <td className={`py-3 ${row.pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {formatCurrency(row.pnl)}
                        </td>
                        <td className={`py-3 ${row.changePct >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {row.changePct.toFixed(2)}%
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
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((s) => {
                      const value = s.shares * s.currentPrice;
                      const pnl = s.shares * (s.currentPrice - s.purchasePrice);
                      return (
                        <tr key={s.symbol} className="border-b/50">
                          <td className="py-3 font-medium">{s.symbol}</td>
                          <td className="py-3">{s.shares}</td>
                          <td className="py-3">{formatCurrency(s.purchasePrice)}</td>
                          <td className="py-3">{formatCurrency(s.currentPrice)}</td>
                          <td className="py-3">{formatCurrency(value)}</td>
                          <td className={`py-3 ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatCurrency(pnl)}</td>
                        </tr>
                      );
                    })}
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
                    </tr>
                  </thead>
                  <tbody>
                    {funds.map((f) => {
                      const value = f.units * f.currentPrice;
                      const pnl = f.units * (f.currentPrice - f.nav);
                      return (
                        <tr key={f.symbol} className="border-b/50">
                          <td className="py-3 font-medium">{f.symbol}</td>
                          <td className="py-3">{f.units}</td>
                          <td className="py-3">{formatCurrency(f.nav)}</td>
                          <td className="py-3">{formatCurrency(f.currentPrice)}</td>
                          <td className="py-3">{formatCurrency(value)}</td>
                          <td className={`py-3 ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatCurrency(pnl)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
