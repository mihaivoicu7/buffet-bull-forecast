
import React, { useState, useEffect } from 'react';
import { StockData, getBuffettRecommendations, getWatchlist } from '@/services/stockService';
import StockSearch from '@/components/StockSearch';
import StockDetails from '@/components/StockDetails';
import BuffettRecommendations from '@/components/BuffettRecommendations';
import WatchlistTable from '@/components/WatchlistTable';

const Dashboard: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [recommendations, setRecommendations] = useState<StockData[]>([]);
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const data = await getBuffettRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
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
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Stock Forecaster</h1>
          <StockSearch onSelectStock={handleSelectStock} />
        </div>
        <div className="w-full sm:w-1/3 bg-financial-900 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Buffett Wisdom</h2>
          <blockquote className="border-l-4 border-financial-500 pl-4 italic">
            "Price is what you pay. Value is what you get."
          </blockquote>
          <p className="mt-4 text-sm">
            Warren Buffett focuses on finding companies with strong fundamentals, 
            competitive advantages, and fair valuations for long-term investing success.
          </p>
        </div>
      </div>

      {selectedStock && (
        <StockDetails stock={selectedStock} />
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
          <WatchlistTable 
            stocks={watchlist} 
            onSelectStock={handleSelectStock}
            onWatchlistChange={handleWatchlistChange}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended Stocks</h2>
          <BuffettRecommendations 
            stocks={recommendations}
            onSelectStock={handleSelectStock}
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
