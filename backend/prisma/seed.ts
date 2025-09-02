import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const initialStocks = [
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

const initialFunds = [
  { symbol: "HDFC AMC", fund: "Equity Large Cap", units: 120, nav: 8, currentPrice: 8.75 },
  { symbol: "SBI Bluechip", fund: "Large Cap", units: 200, nav: 15, currentPrice: 15.6 },
  { symbol: "ICICI Pru Tech", fund: "Sectoral - Technology", units: 150, nav: 25, currentPrice: 26.2 },
  { symbol: "Axis Small Cap", fund: "Small Cap", units: 100, nav: 60, currentPrice: 62.4 },
  { symbol: "Kotak Emerging", fund: "Mid Cap", units: 90, nav: 48, currentPrice: 50.5 },
  { symbol: "Nippon Pharma", fund: "Sectoral - Pharma", units: 70, nav: 110, currentPrice: 114 },
  { symbol: "UTI Flexi Cap", fund: "Flexi Cap", units: 130, nav: 45, currentPrice: 46.8 },
];

async function main() {
  try {
    console.log('🌱 Starting seed...');

    // Create a demo user (you can modify this based on your auth setup)
    const user = await prisma.user.upsert({
      where: { email: 'demo3@example.com' },
      update: {},
      create: {
        email: 'demo3@example.com',
        username: 'Demo3User',
        password: 'securepassword' // In a real app, ensure passwords are hashed
      },
    });

    console.log(`📝 Created user: ${user.email}`);

    // Clear existing data for this user
    await prisma.stock.deleteMany({
      where: { userId: user.id }
    });
    
    await prisma.mutualFund.deleteMany({
      where: { userId: user.id }
    });

    console.log('🗑️  Cleared existing portfolio data');

    // Seed stocks
    const stockPromises = initialStocks.map(stock =>
      prisma.stock.create({
        data: {
          ...stock,
          userId: user.id
        }
      })
    );

    const createdStocks = await Promise.all(stockPromises);
    console.log(`📈 Created ${createdStocks.length} stocks`);

    // Seed mutual funds
    const fundPromises = initialFunds.map(fund =>
      prisma.mutualFund.create({
        data: {
          ...fund,
          userId: user.id
        }
      })
    );

    const createdFunds = await Promise.all(fundPromises);
    console.log(`📊 Created ${createdFunds.length} mutual funds`);

    // Calculate and display summary
    const totalStockInvestment = initialStocks.reduce((sum, stock) => 
      sum + (stock.shares * stock.purchasePrice), 0
    );
    const totalStockValue = initialStocks.reduce((sum, stock) => 
      sum + (stock.shares * stock.currentPrice), 0
    );

    const totalFundInvestment = initialFunds.reduce((sum, fund) => 
      sum + (fund.units * fund.nav), 0
    );
    const totalFundValue = initialFunds.reduce((sum, fund) => 
      sum + (fund.units * fund.currentPrice), 0
    );

    const totalInvestment = totalStockInvestment + totalFundInvestment;
    const totalCurrentValue = totalStockValue + totalFundValue;
    const totalGainLoss = totalCurrentValue - totalInvestment;
    const gainLossPercentage = (totalGainLoss / totalInvestment) * 100;

    console.log('\n💰 Portfolio Summary:');
    console.log(`   Total Investment: ₹${totalInvestment.toLocaleString()}`);
    console.log(`   Current Value: ₹${totalCurrentValue.toLocaleString()}`);
    console.log(`   Gain/Loss: ₹${totalGainLoss.toLocaleString()} (${gainLossPercentage.toFixed(2)}%)`);
    
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });