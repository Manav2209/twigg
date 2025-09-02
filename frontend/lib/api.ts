const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export type PortfolioSummary = {
        totalInvestment: number;
        currentValue: number;
        totalGainLoss: number;
        totalGainLossPercentage: number;
    };
  
export type PortfolioResponse = {
        summary: PortfolioSummary;
        stocks: StockWithMetrics[];
        mutualFunds: MutualFundWithMetrics[];
};
  
export type PerformanceResponse = {
        topPerformers: Array<{
        symbol: string;
        type: 'stock' | 'mutual_fund';
        gainLossPercentage: number;
        totalValue: number;
        }>;
        worstPerformers: Array<{
        symbol: string;
        type: 'stock' | 'mutual_fund';
        gainLossPercentage: number;
        totalValue: number;
        }>;
        allocation: {
        stocks: { value: number; percentage: number };
        mutualFunds: { value: number; percentage: number };
        };
        totalPortfolioValue: number;
};
  // API Response Types
export type StockWithMetrics = {
    id: string;
    symbol: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    userId: string;
    totalValue: number;
    gainLoss: number;
    gainLossPercentage: number;
    createdAt: string;
    updatedAt: string;
};
  
export type MutualFundWithMetrics = {
    id: string;
    symbol: string;
    fund: string;
    units: number;
    nav: number;
    currentPrice: number;
    userId: string;
    totalValue: number;
    gainLoss: number;
    gainLossPercentage: number;
    createdAt: string;
    updatedAt: string;
};
  
export const apiClient = {
    async getPortfolio(): Promise<PortfolioResponse> {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
        headers: {
            'Authorization': `${localStorage.getItem('token')}`, // Adjust based on your auth
            'Content-Type': 'application/json',
        },
        });
        
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

  async getPerformance(): Promise<PerformanceResponse> {
    const response = await fetch(`${API_BASE_URL}/portfolio/performance`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async getStocks(): Promise<StockWithMetrics[]> {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async getMutualFunds(): Promise<MutualFundWithMetrics[]> {
    const response = await fetch(`${API_BASE_URL}/mutual-funds`, {
      headers: {
        'Authorization': `${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};