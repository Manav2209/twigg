import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';
import { signinSchema, signupSchema, type MutualFundWithMetrics, type PortfolioSummary, type StockWithMetrics } from './utils/types';
import { JWT_SECRET } from './config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authMiddleware } from './middleware';

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.post('/signup', async (req, res) => {
  try {
    const response = signupSchema.safeParse(req.body);
    if (!response.success) {
      return res.status(400).json({ error: response.error, success: false });
    }

    const { username, email, password } = response.data;

    const existedUser = await prisma.user.findUnique({ where: { email } });
    if (existedUser) {
      return res.status(400).json({ error: "User already exists with this email", success: false });
    }



    const user = await prisma.user.create({
      data: { username, email, password },
      select: { id: true, username: true, email: true } // exclude password
    });

    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", success: false });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const response = signinSchema.safeParse(req.body);
    
    if (!response.success) {
      return res.status(400).json({ error: response.error, success: false });
    }

    const { email, password } = response.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found", success: false });
    }
   const  isPasswordValid =  password === user.password

   if(!isPasswordValid){
    return res.status(400).json({ error: "Invalid password", success: false });
   }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "3h" });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", success: false });
  }
});

app.get('/portfolio',authMiddleware, async (req, res) => {
  try {
    const userId = req.userId // Assuming auth middleware sets req.user
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [stocks, mutualFunds] = await Promise.all([
      prisma.stock.findMany({
        where: { userId },
        orderBy: { symbol: 'asc' }
      }),
      prisma.mutualFund.findMany({
        where: { userId },
        orderBy: { symbol: 'asc' }
      })
    ]);

    // Calculate metrics for stocks
    const stocksWithMetrics: StockWithMetrics[] = stocks.map(stock => {
      const totalValue = stock.shares * stock.currentPrice;
      const investment = stock.shares * stock.purchasePrice;
      const gainLoss = totalValue - investment;
      const gainLossPercentage = (gainLoss / investment) * 100;

      return {
        ...stock,
        totalValue,
        gainLoss,
        gainLossPercentage
      };
    });

    // Calculate metrics for mutual funds
    const mutualFundsWithMetrics: MutualFundWithMetrics[] = mutualFunds.map(fund => {
      const totalValue = fund.units * fund.currentPrice;
      const investment = fund.units * fund.nav;
      const gainLoss = totalValue - investment;
      const gainLossPercentage = (gainLoss / investment) * 100;

      return {
        ...fund,
        totalValue,
        gainLoss,
        gainLossPercentage
      };
    });

    // Calculate portfolio summary
    const stockInvestment = stocksWithMetrics.reduce((sum, stock) => 
      sum + (stock.shares * stock.purchasePrice), 0
    );
    const stockCurrentValue = stocksWithMetrics.reduce((sum, stock) => 
      sum + stock.totalValue, 0
    );

    const fundInvestment = mutualFundsWithMetrics.reduce((sum, fund) => 
      sum + (fund.units * fund.nav), 0
    );
    const fundCurrentValue = mutualFundsWithMetrics.reduce((sum, fund) => 
      sum + fund.totalValue, 0
    );

    const totalInvestment = stockInvestment + fundInvestment;
    const currentValue = stockCurrentValue + fundCurrentValue;
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

    const summary: PortfolioSummary = {
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage
    };

    res.json({
      summary,
      stocks: stocksWithMetrics,
      mutualFunds: mutualFundsWithMetrics
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/stocks - Get all stocks for the user
app.get('/stocks',authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stocks = await prisma.stock.findMany({
      where: { userId },
      orderBy: { symbol: 'asc' }
    });

    const stocksWithMetrics = stocks.map(stock => {
      const totalValue = stock.shares * stock.currentPrice;
      const investment = stock.shares * stock.purchasePrice;
      const gainLoss = totalValue - investment;
      const gainLossPercentage = (gainLoss / investment) * 100;

      return {
        ...stock,
        totalValue,
        gainLoss,
        gainLossPercentage
      };
    });

    res.json(stocksWithMetrics);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/stocks/:symbol - Get specific stock by symbol
app.get('/stocks/:symbol', authMiddleware ,async (req, res) => {
  try {
    const userId = req.userId;
    const { symbol } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if(!symbol){
      return res.status(400).json({ error: 'Symbol is required' });
    }
    const stock = await prisma.stock.findFirst({
      where: { 
        userId,
        symbol: symbol.toUpperCase()
      }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const totalValue = stock.shares * stock.currentPrice;
    const investment = stock.shares * stock.purchasePrice;
    const gainLoss = totalValue - investment;
    const gainLossPercentage = (gainLoss / investment) * 100;

    const stockWithMetrics = {
      ...stock,
      totalValue,
      gainLoss,
      gainLossPercentage
    };

    res.json(stockWithMetrics);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mutual-funds - Get all mutual funds for the user
app.get('/mutual-funds',authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const mutualFunds = await prisma.mutualFund.findMany({
      where: { userId },
      orderBy: { symbol: 'asc' }
    });

    const fundsWithMetrics = mutualFunds.map(fund => {
      const totalValue = fund.units * fund.currentPrice;
      const investment = fund.units * fund.nav;
      const gainLoss = totalValue - investment;
      const gainLossPercentage = (gainLoss / investment) * 100;

      return {
        ...fund,
        totalValue,
        gainLoss,
        gainLossPercentage
      };
    });

    res.json(fundsWithMetrics);
  } catch (error) {
    console.error('Error fetching mutual funds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mutual-funds/:symbol - Get specific mutual fund by symbol
app.get('/mutual-funds/:symbol', authMiddleware ,async (req, res) => {
  try {
    const userId = req.userId
    const { symbol } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if(!symbol){
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const mutualFund = await prisma.mutualFund.findFirst({
      where: { 
        userId,
        symbol: symbol
      }
    });

    if (!mutualFund) {
      return res.status(404).json({ error: 'Mutual fund not found' });
    }

    const totalValue = mutualFund.units * mutualFund.currentPrice;
    const investment = mutualFund.units * mutualFund.nav;
    const gainLoss = totalValue - investment;
    const gainLossPercentage = (gainLoss / investment) * 100;

    const fundWithMetrics = {
      ...mutualFund,
      totalValue,
      gainLoss,
      gainLossPercentage
    };

    res.json(fundWithMetrics);
  } catch (error) {
    console.error('Error fetching mutual fund:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/portfolio/summary - Get portfolio summary only
app.get('/portfolio/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [stocks, mutualFunds] = await Promise.all([
      prisma.stock.findMany({
        where: { userId }
      }),
      prisma.mutualFund.findMany({
        where: { userId }
      })
    ]);

    
    const stockInvestment = stocks.reduce((sum, stock) => 
      sum + (stock.shares * stock.purchasePrice), 0
    );
    const stockCurrentValue = stocks.reduce((sum, stock) => 
      sum + (stock.shares * stock.currentPrice), 0
    );

    const fundInvestment = mutualFunds.reduce((sum, fund) => 
      sum + (fund.units * fund.nav), 0
    );
    const fundCurrentValue = mutualFunds.reduce((sum, fund) => 
      sum + (fund.units * fund.currentPrice), 0
    );

    const totalInvestment = stockInvestment + fundInvestment;
    const currentValue = stockCurrentValue + fundCurrentValue;
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

    const summary: PortfolioSummary = {
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/portfolio/performance - Get performance analytics
app.get('/portfolio/performance', authMiddleware ,async (req, res) => {
  try {
    const userId = req.userId
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [stocks, mutualFunds] = await Promise.all([
      prisma.stock.findMany({
        where: { userId }
      }),
      prisma.mutualFund.findMany({
        where: { userId }
      })
    ]);

    // Top performers
    const stockPerformers = stocks.map(stock => {
      const gainLoss = (stock.currentPrice - stock.purchasePrice) / stock.purchasePrice * 100;
      return {
        symbol: stock.symbol,
        type: 'stock' as const,
        gainLossPercentage: gainLoss,
        totalValue: stock.shares * stock.currentPrice
      };
    });

    const fundPerformers = mutualFunds.map(fund => {
      const gainLoss = (fund.currentPrice - fund.nav) / fund.nav * 100;
      return {
        symbol: fund.symbol,
        type: 'mutual_fund' as const,
        gainLossPercentage: gainLoss,
        totalValue: fund.units * fund.currentPrice
      };
    });

    const allPerformers = [...stockPerformers, ...fundPerformers]
      .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage);

    const topPerformers = allPerformers.slice(0, 5);
    const worstPerformers = allPerformers.slice(-5).reverse();

    // Asset allocation
    const totalStockValue = stockPerformers.reduce((sum, stock) => sum + stock.totalValue, 0);
    const totalFundValue = fundPerformers.reduce((sum, fund) => sum + fund.totalValue, 0);
    const totalValue = totalStockValue + totalFundValue;

    const allocation = {
      stocks: {
        value: totalStockValue,
        percentage: (totalStockValue / totalValue) * 100
      },
      mutualFunds: {
        value: totalFundValue,
        percentage: (totalFundValue / totalValue) * 100
      }
    };

    res.json({
      topPerformers,
      worstPerformers,
      allocation,
      totalPortfolioValue: totalValue
    });
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/stocks/:symbol/buy', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { symbol } = req.params;
    const { shares, purchasePrice, currentPrice } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!symbol || !shares || !purchasePrice || !currentPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stock = await prisma.stock.findFirst({
      where: { userId, symbol: symbol.toUpperCase() }
    });

    if (stock) {
      // Update existing stock
      const totalShares = stock.shares + shares;
      const avgPurchasePrice = ((stock.shares * stock.purchasePrice) + (shares * purchasePrice)) / totalShares;

      const updatedStock = await prisma.stock.update({
        where: { id: stock.id },
        data: {
          shares: totalShares,
          purchasePrice: avgPurchasePrice,
          currentPrice
        }
      });

      return res.json(updatedStock);
    } else {
      // Create new stock entry
      const newStock = await prisma.stock.create({
        data: {
          userId,
          symbol: symbol.toUpperCase(),
          shares,
          purchasePrice,
          currentPrice
        }
      });

      return res.status(201).json(newStock);
    }
  } catch (error) {
    console.error('Error buying stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
