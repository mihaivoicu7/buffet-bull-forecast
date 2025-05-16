
import { toast } from "sonner";

// Define interfaces for stock data
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  debtToEquity: number | null;
  returnOnEquity: number | null;
  priceToBook: number | null;
}

export interface StockHistoricalData {
  date: string;
  close: number;
}

// Mock data to simulate API responses
const MOCK_STOCKS: Record<string, StockData> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 172.40,
    change: 2.35,
    changePercent: 1.38,
    marketCap: 2680000000000,
    peRatio: 28.4,
    eps: 6.07,
    dividendYield: 0.55,
    debtToEquity: 1.76,
    returnOnEquity: 33.21,
    priceToBook: 32.12
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 410.34,
    change: -1.23,
    changePercent: -0.30,
    marketCap: 3050000000000,
    peRatio: 34.9,
    eps: 11.78,
    dividendYield: 0.72,
    debtToEquity: 0.42,
    returnOnEquity: 38.41,
    priceToBook: 11.83
  },
  "BRK.B": {
    symbol: "BRK.B",
    name: "Berkshire Hathaway Inc.",
    price: 412.87,
    change: 3.67,
    changePercent: 0.90,
    marketCap: 899000000000,
    peRatio: 10.2,
    eps: 40.48,
    dividendYield: null,
    debtToEquity: 0.25,
    returnOnEquity: 14.73,
    priceToBook: 1.47
  },
  KO: {
    symbol: "KO",
    name: "The Coca-Cola Company",
    price: 62.80,
    change: 0.45,
    changePercent: 0.72,
    marketCap: 271000000000,
    peRatio: 25.1,
    eps: 2.50,
    dividendYield: 2.90,
    debtToEquity: 1.82,
    returnOnEquity: 33.80,
    priceToBook: 10.56
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 184.72,
    change: -2.14,
    changePercent: -1.15,
    marketCap: 1910000000000,
    peRatio: 51.3,
    eps: 3.60,
    dividendYield: null,
    debtToEquity: 0.68,
    returnOnEquity: 12.18,
    priceToBook: 8.42
  }
};

// Generate mock historical data
const generateMockHistoricalData = (symbol: string): StockHistoricalData[] => {
  const data: StockHistoricalData[] = [];
  const today = new Date();
  const basePrice = MOCK_STOCKS[symbol]?.price || 100;
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some variation in the price
    const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
    const volatility = Math.random() * 0.1; // Add some randomness
    
    // Make price generally trend upward for good stocks
    const trendFactor = symbol === "BRK.B" || symbol === "AAPL" || symbol === "KO" ? 
      1 + (i / 3650) : 1 + (i / 7300);
    
    const close = basePrice * randomFactor * volatility * trendFactor;
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: parseFloat(close.toFixed(2))
    });
  }
  
  return data;
};

// Search for stocks
export const searchStocks = async (query: string): Promise<StockData[]> => {
  try {
    // In a real app, this would be an API call to Yahoo Finance
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Filter mock data to match query
    const results = Object.values(MOCK_STOCKS).filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return results;
  } catch (error) {
    console.error("Error searching stocks:", error);
    toast.error("Failed to search stocks. Please try again.");
    return [];
  }
};

// Get detailed stock information
export const getStockDetails = async (symbol: string): Promise<StockData | null> => {
  try {
    // In a real app, this would be an API call to Yahoo Finance
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
    
    const stock = MOCK_STOCKS[symbol];
    if (!stock) {
      toast.error(`Stock with symbol ${symbol} not found`);
      return null;
    }
    
    return stock;
  } catch (error) {
    console.error("Error getting stock details:", error);
    toast.error("Failed to fetch stock details. Please try again.");
    return null;
  }
};

// Get historical stock data
export const getHistoricalData = async (
  symbol: string,
  period: "1mo" | "3mo" | "6mo" | "1y" | "5y" = "1y"
): Promise<StockHistoricalData[]> => {
  try {
    // In a real app, this would be an API call to Yahoo Finance
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    // Get mock historical data
    const allData = generateMockHistoricalData(symbol);
    
    // Filter based on period
    const today = new Date();
    let startDate = new Date(today);
    
    switch (period) {
      case "1mo":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3mo":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6mo":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "5y":
        startDate.setFullYear(today.getFullYear() - 5);
        break;
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return allData.filter(item => item.date >= startDateStr);
  } catch (error) {
    console.error("Error getting historical data:", error);
    toast.error("Failed to fetch historical data. Please try again.");
    return [];
  }
};

// Get Warren Buffett style recommendations
export const getBuffettRecommendations = async (): Promise<StockData[]> => {
  try {
    // In a real app, this would analyze stocks based on Buffett principles
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate complex analysis
    
    // Filter stocks based on Warren Buffett principles:
    // 1. Low P/E ratio
    // 2. Strong return on equity
    // 3. Low debt-to-equity
    // 4. Consistent earnings growth
    
    const buffettPicks = Object.values(MOCK_STOCKS).filter(stock => 
      (stock.peRatio !== null && stock.peRatio < 20) && 
      (stock.returnOnEquity !== null && stock.returnOnEquity > 15) &&
      (stock.debtToEquity !== null && stock.debtToEquity < 2)
    );
    
    return buffettPicks;
  } catch (error) {
    console.error("Error getting Buffett recommendations:", error);
    toast.error("Failed to generate recommendations. Please try again.");
    return [];
  }
};

// Save a stock to watchlist (would connect to backend in a real app)
export const addToWatchlist = async (symbol: string): Promise<boolean> => {
  try {
    // In a real app, this would add to a database
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    // Get current watchlist from localStorage
    const watchlistStr = localStorage.getItem('watchlist') || '[]';
    const watchlist = JSON.parse(watchlistStr) as string[];
    
    // Check if already in watchlist
    if (watchlist.includes(symbol)) {
      return true;
    }
    
    // Add to watchlist
    watchlist.push(symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    toast.success(`Added ${symbol} to watchlist`);
    return true;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    toast.error("Failed to add to watchlist. Please try again.");
    return false;
  }
};

// Remove a stock from watchlist
export const removeFromWatchlist = async (symbol: string): Promise<boolean> => {
  try {
    // In a real app, this would remove from a database
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    // Get current watchlist from localStorage
    const watchlistStr = localStorage.getItem('watchlist') || '[]';
    const watchlist = JSON.parse(watchlistStr) as string[];
    
    // Remove from watchlist
    const newWatchlist = watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    
    toast.success(`Removed ${symbol} from watchlist`);
    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    toast.error("Failed to remove from watchlist. Please try again.");
    return false;
  }
};

// Get watchlist stocks
export const getWatchlist = async (): Promise<StockData[]> => {
  try {
    // In a real app, this would fetch from a database
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Get current watchlist from localStorage
    const watchlistStr = localStorage.getItem('watchlist') || '[]';
    const watchlist = JSON.parse(watchlistStr) as string[];
    
    // Get details for each stock
    const stocks = await Promise.all(
      watchlist.map(async symbol => {
        const stock = await getStockDetails(symbol);
        return stock;
      })
    );
    
    return stocks.filter(Boolean) as StockData[];
  } catch (error) {
    console.error("Error getting watchlist:", error);
    toast.error("Failed to fetch watchlist. Please try again.");
    return [];
  }
};
