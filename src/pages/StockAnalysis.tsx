
import React, { useState, useEffect } from 'react';
import { StockData, searchStocks, getBuffettRecommendations } from '@/services/stockService';
import StockSearch from '@/components/StockSearch';
import StockDetails from '@/components/StockDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockAnalysis: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [recommendations, setRecommendations] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const data = await getBuffettRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Stock Analysis</h1>
      
      <StockSearch onSelectStock={handleSelectStock} />
      
      {selectedStock ? (
        <StockDetails stock={selectedStock} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Warren Buffett's Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="font-medium">Business Quality</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Look for simple, understandable businesses with consistent operating history and favorable long-term prospects.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Management Quality</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Seek out companies with honest, competent management that acts in shareholders' interests.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Financial Strength</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Focus on businesses with strong earnings, high return on equity, and low debt.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Value</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Buy at a significant discount to intrinsic value to provide a margin of safety.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="font-medium">P/E Ratio</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Price-to-earnings ratio shows how much investors are willing to pay per dollar of earnings. Lower P/E ratios may indicate undervaluation.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Return on Equity (ROE)</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Measures a company's profitability in relation to shareholders' equity. Higher ROE indicates more efficient use of capital.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Debt-to-Equity Ratio</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Shows how much debt a company uses relative to equity. Lower ratios indicate less financial risk.
                  </p>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium">Dividend Yield</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Annual dividend payments relative to share price. Stable or growing dividends often signal financial health.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Investment Wisdom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="border-l-4 border-financial-500 pl-4 italic text-gray-700">
                "Be fearful when others are greedy and greedy when others are fearful."
              </blockquote>
              
              <blockquote className="border-l-4 border-financial-500 pl-4 italic text-gray-700">
                "Our favorite holding period is forever."
              </blockquote>
              
              <blockquote className="border-l-4 border-financial-500 pl-4 italic text-gray-700">
                "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price."
              </blockquote>
              
              <blockquote className="border-l-4 border-financial-500 pl-4 italic text-gray-700">
                "Risk comes from not knowing what you're doing."
              </blockquote>
              
              <blockquote className="border-l-4 border-financial-500 pl-4 italic text-gray-700">
                "The most important quality for an investor is temperament, not intellect."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;
