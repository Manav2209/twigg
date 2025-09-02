import z from "zod";

export const signupSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface MutualFund {
  symbol: string;
  fund: string;
  units: number;
  nav: number;
  currentPrice: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface StockWithMetrics extends Stock {
  id: string;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MutualFundWithMetrics extends MutualFund {
  id: string;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}