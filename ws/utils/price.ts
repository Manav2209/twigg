export function generatePriceMovement(currentPrice: number, volatility = 0.02): number {
    const randomChange = (Math.random() - 0.5) * 2;
    const maxChange = currentPrice * volatility;
    const priceChange = randomChange * maxChange;
  
    const trend = Math.sin(Date.now() / 100000) * 0.3;
    const finalChange = priceChange + (trend * maxChange * 0.5);
  
    return Math.max(0.01, currentPrice + finalChange);
  }
  