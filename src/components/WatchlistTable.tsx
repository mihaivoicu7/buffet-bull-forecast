
import React from 'react';
import { StockData, removeFromWatchlist } from '@/services/stockService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, X } from 'lucide-react';

interface WatchlistTableProps {
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
  onWatchlistChange: () => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ 
  stocks, 
  onSelectStock,
  onWatchlistChange
}) => {
  const handleRemove = async (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeFromWatchlist(symbol);
    onWatchlistChange();
  };

  if (stocks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md shadow-sm text-center">
        <p className="text-gray-600 mb-4">Your watchlist is empty.</p>
        <p className="text-sm">
          Search for stocks and add them to your watchlist to track them here.
        </p>
      </div>
    );
  }

  return (
    <Table className="bg-white rounded-md shadow-sm">
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="text-right">P/E Ratio</TableHead>
          <TableHead className="text-right">Buffett Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => {
          // Calculate Buffett score
          let score = 0;
          if (stock.peRatio !== null && stock.peRatio > 0 && stock.peRatio < 20) score += 2;
          if (stock.returnOnEquity !== null && stock.returnOnEquity > 15) score += 3;
          if (stock.debtToEquity !== null && stock.debtToEquity < 1) score += 3;
          if (stock.dividendYield !== null && stock.dividendYield > 1) score += 2;
          
          const buffettScore = Math.min(10, score);
          
          return (
            <TableRow 
              key={stock.symbol}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectStock(stock)}
            >
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <span 
                  className={`flex items-center justify-end ${stock.change >= 0 ? 'stock-up' : 'stock-down'}`}
                >
                  {stock.change >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </TableCell>
              <TableCell className="text-right">
                {stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <span 
                  className={
                    buffettScore >= 7 ? 'text-success-500' : 
                    buffettScore >= 4 ? 'text-amber-500' : 
                    'text-danger-500'
                  }
                >
                  {buffettScore}/10
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemove(stock.symbol, e)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default WatchlistTable;
