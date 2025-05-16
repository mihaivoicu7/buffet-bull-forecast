
import React, { useState, useEffect } from 'react';
import { StockData, getWatchlist } from '@/services/stockService';
import StockDetails from '@/components/StockDetails';
import WatchlistTable from '@/components/WatchlistTable';

const Watchlist: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const data = await getWatchlist();
      setStocks(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchlistChange = () => {
    fetchWatchlist();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
      
      {selectedStock ? (
        <>
          <StockDetails stock={selectedStock} />
          <div className="mt-8">
            <button 
              onClick={() => setSelectedStock(null)}
              className="text-financial-700 hover:text-financial-900 underline font-medium"
            >
              Back to Watchlist
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600">
            Track your potential investments and analyze them based on Warren Buffett's principles.
          </p>
          
          {loading ? (
            <div className="bg-white p-6 rounded-md shadow-sm text-center">
              <p className="text-gray-600">Loading your watchlist...</p>
            </div>
          ) : (
            <WatchlistTable 
              stocks={stocks} 
              onSelectStock={handleSelectStock}
              onWatchlistChange={handleWatchlistChange}
            />
          )}
          
          {!loading && stocks.length === 0 && (
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Buffett's Investment Checklist</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                  <span>Do I understand the business model completely?</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                  <span>Does the company have a sustainable competitive advantage ("moat")?</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                  <span>Is management candid with shareholders and do they have integrity?</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                  <span>Does the company have consistent earnings with high return on equity?</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">5</span>
                  <span>Does the company have little debt and generate strong free cash flow?</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-financial-100 text-financial-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">6</span>
                  <span>Is the stock trading at a reasonable price relative to its intrinsic value?</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
