
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StockData, searchStocks } from '@/services/stockService';

interface StockSearchProps {
  onSelectStock: (stock: StockData) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      const searchResults = await searchStocks(query);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Input 
          type="text" 
          placeholder="Search for stocks (e.g., AAPL, Microsoft)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-financial-700 hover:bg-financial-800"
        >
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="bg-white border rounded-md shadow-sm">
          <ul className="divide-y">
            {results.map((stock) => (
              <li 
                key={stock.symbol} 
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors" 
                onClick={() => onSelectStock(stock)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{stock.symbol}</span>
                    <span className="text-gray-600 ml-2">{stock.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">${stock.price.toFixed(2)}</span>
                    <span className={stock.change >= 0 ? "stock-up text-sm" : "stock-down text-sm"}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
