import { generatePriceMovement } from "../utils/price.js";

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
}

export interface Fund {
    symbol: string;
    fund: string;
    currentPrice: number;
    previousPrice: number;
    change: number;
    changePercent: number;
  }
  
  const initialMutualFunds = [
    { symbol: "HDFC AMC", fund: "Equity Large Cap", currentPrice: 8.75 },
    { symbol: "SBI Bluechip", fund: "Large Cap", currentPrice: 15.6 },
    { symbol: "ICICI Pru Tech", fund: "Sectoral - Technology", currentPrice: 26.2 },
    { symbol: "Axis Small Cap", fund: "Small Cap", currentPrice: 62.4 },
    { symbol: "Kotak Emerging", fund: "Mid Cap", currentPrice: 50.5 },
    { symbol: "Nippon Pharma", fund: "Sectoral - Pharma", currentPrice: 114.0 },
    { symbol: "UTI Flexi Cap", fund: "Flexi Cap", currentPrice: 46.8 },
    { symbol: "Reliance Growth", fund: "Growth", currentPrice: 78.5 },
    { symbol: "Motilal ELSS", fund: "Tax Saver", currentPrice: 92.3 },
    { symbol: "DSP Mid Cap", fund: "Mid Cap", currentPrice: 156.7 }
  ];
  
const initialStocks = [
  { symbol: "AAPL", name: "Apple Inc.", currentPrice: 195.0 },
  { symbol: "GOOGL", name: "Alphabet Inc.", currentPrice: 2850.0 },
  { symbol: "TSLA", name: "Tesla Inc.", currentPrice: 900.0 },
  { symbol: "MSFT", name: "Microsoft Corp.", currentPrice: 340.0 },
  { symbol: "AMZN", name: "Amazon.com Inc.", currentPrice: 3560.0 },
  { symbol: "META", name: "Meta Platforms", currentPrice: 280.0 },
  { symbol: "NFLX", name: "Netflix Inc.", currentPrice: 610.0 },
  { symbol: "NVDA", name: "NVIDIA Corp.", currentPrice: 820.0 },
  { symbol: "IBM", name: "IBM Corp.", currentPrice: 138.0 },
  { symbol: "ORCL", name: "Oracle Corp.", currentPrice: 110.0 }
];

export let currentStocks: Stock[] = initialStocks.map(stock => ({
  ...stock,
  previousPrice: stock.currentPrice,
  change: 0,
  changePercent: 0
}));

export function updateStockPrices(): void {
  currentStocks = currentStocks.map(stock => {
    const previousPrice = stock.currentPrice;
    const newPrice = generatePriceMovement(stock.currentPrice, 0.025);
    const change = newPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      ...stock,
      previousPrice,
      currentPrice: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  });
}


export let currentMutualFunds: Fund[] = initialMutualFunds.map(fund => ({
  ...fund,
  previousPrice: fund.currentPrice,
  change: 0,
  changePercent: 0
}));

export function updateMutualFundPrices(): void {
  currentMutualFunds = currentMutualFunds.map(fund => {
    const previousPrice = fund.currentPrice;
    const newPrice = generatePriceMovement(fund.currentPrice, 0.015);
    const change = newPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      ...fund,
      previousPrice,
      currentPrice: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  });
}
