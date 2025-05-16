
import React, { useState, useEffect } from 'react';
import { StockData, getHistoricalData, StockHistoricalData, addToWatchlist } from '@/services/stockService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailsProps {
  stock: StockData;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([]);
  const [period, setPeriod] = useState<"1mo" | "3mo" | "6mo" | "1y" | "5y">("1y");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const data = await getHistoricalData(stock.symbol, period);
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [stock.symbol, period]);

  const handleAddToWatchlist = async () => {
    await addToWatchlist(stock.symbol);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`;
    } else if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  const calculateBuffettScore = () => {
    let score = 0;
    
    // P/E ratio (lower is better, but not negative)
    if (stock.peRatio !== null) {
      if (stock.peRatio > 0 && stock.peRatio < 15) score += 3;
      else if (stock.peRatio >= 15 && stock.peRatio < 25) score += 2;
      else if (stock.peRatio >= 25) score += 1;
    }
    
    // Return on equity (higher is better)
    if (stock.returnOnEquity !== null) {
      if (stock.returnOnEquity > 20) score += 3;
      else if (stock.returnOnEquity > 15) score += 2;
      else if (stock.returnOnEquity > 10) score += 1;
    }
    
    // Debt to equity (lower is better)
    if (stock.debtToEquity !== null) {
      if (stock.debtToEquity < 0.5) score += 3;
      else if (stock.debtToEquity < 1) score += 2;
      else if (stock.debtToEquity < 2) score += 1;
    }
    
    // Dividend yield (higher is generally better)
    if (stock.dividendYield !== null) {
      if (stock.dividendYield > 3) score += 2;
      else if (stock.dividendYield > 1) score += 1;
    }
    
    return Math.min(10, score);
  };

  const buffettScore = calculateBuffettScore();
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h2>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-semibold">${stock.price.toFixed(2)}</span>
            <span 
              className={`ml-2 flex items-center ${stock.change >= 0 ? 'stock-up' : 'stock-down'}`}
            >
              {stock.change >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <Button 
          onClick={handleAddToWatchlist}
          className="bg-financial-700 hover:bg-financial-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1y" onValueChange={(value) => setPeriod(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="1mo">1M</TabsTrigger>
              <TabsTrigger value="3mo">3M</TabsTrigger>
              <TabsTrigger value="6mo">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
              <TabsTrigger value="5y">5Y</TabsTrigger>
            </TabsList>
            <TabsContent value={period}>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  Loading chart data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={historicalData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#1a75ff" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Fundamental Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-medium">{formatLargeNumber(stock.marketCap)}</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">P/E Ratio</span>
                <span className="font-medium">
                  {stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">EPS</span>
                <span className="font-medium">
                  {stock.eps !== null ? `$${stock.eps.toFixed(2)}` : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="font-medium">
                  {stock.dividendYield !== null ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Debt-to-Equity</span>
                <span className="font-medium">
                  {stock.debtToEquity !== null ? stock.debtToEquity.toFixed(2) : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Return on Equity</span>
                <span className="font-medium">
                  {stock.returnOnEquity !== null ? `${stock.returnOnEquity.toFixed(2)}%` : 'N/A'}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Buffett Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="text-4xl font-bold mb-2">{buffettScore}/10</div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="h-4 rounded-full" 
                  style={{ 
                    width: `${buffettScore * 10}%`,
                    backgroundColor: buffettScore >= 7 ? '#10b981' : buffettScore >= 4 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-center text-gray-600">
                {buffettScore >= 7 
                  ? "Strong fit with Buffett principles"
                  : buffettScore >= 4
                  ? "Moderate fit with Buffett principles"
                  : "Weak fit with Buffett principles"}
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex flex-col border-b pb-2">
                <span className="text-gray-600">Business Understanding</span>
                <p className="text-sm mt-1">
                  "Invest in what you understand." Always research the company's business model thoroughly.
                </p>
              </li>
              <li className="flex flex-col border-b pb-2">
                <span className="text-gray-600">Competitive Advantage</span>
                <p className="text-sm mt-1">
                  Look for companies with a strong "moat" that protects them from competition.
                </p>
              </li>
              <li className="flex flex-col border-b pb-2">
                <span className="text-gray-600">Management Quality</span>
                <p className="text-sm mt-1">
                  Management should be capable, honest, and shareholder-oriented.
                </p>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-600">Margin of Safety</span>
                <p className="text-sm mt-1">
                  Buy at a significant discount to intrinsic value to provide a margin of safety.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetails;
