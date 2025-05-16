
import React, { useState } from 'react';
import { Menu, Search, Home, TrendingUp, List, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-financial-800 text-white flex items-center px-4 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4 text-white hover:bg-financial-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex justify-between items-center">
          <h1 className="text-xl font-bold">Buffett Stock Forecaster</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-financial-700">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-financial-700">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-financial-900 text-white w-64 transition-all duration-300 ease-in-out flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 flex-1">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-financial-800 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/stocks" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-financial-800 transition-colors"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Stock Analysis</span>
                </a>
              </li>
              <li>
                <a 
                  href="/watchlist" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-financial-800 transition-colors"
                >
                  <List className="h-5 w-5" />
                  <span>Watchlist</span>
                </a>
              </li>
              <li>
                <a 
                  href="/alerts" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-financial-800 transition-colors"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>Alerts</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-financial-800">
            <p className="text-sm text-financial-200">
              Buffett Principle: "Be fearful when others are greedy and greedy when others are fearful."
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
