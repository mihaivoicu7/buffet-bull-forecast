
import React from 'react';
import { StockData } from '@/services/stockService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface BuffettRecommendationsProps {
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
}

const BuffettRecommendations: React.FC<BuffettRecommendationsProps> = ({ 
  stocks, 
  onSelectStock 
}) => {
  if (stocks.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Buffett-Style Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Buffett-Style Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => {
            // Calculate a simplified Buffett score
            let score = 0;
            if (stock.peRatio !== null && stock.peRatio > 0 && stock.peRatio < 20) score += 2;
            if (stock.returnOnEquity !== null && stock.returnOnEquity > 15) score += 3;
            if (stock.debtToEquity !== null && stock.debtToEquity < 1) score += 3;
            if (stock.dividendYield !== null && stock.dividendYield > 1) score += 2;
            
            const buffettScore = Math.min(10, score);

            return (
              <div 
                key={stock.symbol}
                className="border rounded-md p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => onSelectStock(stock)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="bg-financial-100 text-financial-900 px-2 py-1 rounded-md text-sm font-medium">
                    {buffettScore}/10
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="font-medium">${stock.price.toFixed(2)}</span>
                  <span 
                    className={`flex items-center ${stock.change >= 0 ? 'stock-up' : 'stock-down'}`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-gray-600">P/E Ratio</span>
                    <span className="font-medium">
                      {stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-gray-600">Debt/Equity</span>
                    <span className="font-medium">
                      {stock.debtToEquity !== null ? stock.debtToEquity.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-gray-600">ROE</span>
                    <span className="font-medium">
                      {stock.returnOnEquity !== null ? `${stock.returnOnEquity.toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-gray-600">Dividend</span>
                    <span className="font-medium">
                      {stock.dividendYield !== null ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuffettRecommendations;
