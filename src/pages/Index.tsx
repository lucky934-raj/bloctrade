
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Settings, BarChart3, Activity } from 'lucide-react';
import OrderBook from '../components/OrderBook';
import PriceChart from '../components/PriceChart';
import OrderPanel from '../components/OrderPanel';
import RecentTrades from '../components/RecentTrades';
import WalletConnection from '../components/WalletConnection';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [currentPrice, setCurrentPrice] = useState(2024.50);
  const [priceChange, setPriceChange] = useState(2.34);
  const [priceChangePercent, setPriceChangePercent] = useState(0.12);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setCurrentPrice(prev => Math.max(1800, prev + change));
      setPriceChange(change);
      setPriceChangePercent((change / currentPrice) * 100);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold">TradePro</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">ETH/USDT</div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-mono font-bold">
                  ${currentPrice.toFixed(2)}
                </span>
                <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-mono">
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Trading Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Order Book */}
        <div className="w-80 min-w-80 max-w-80 border-r border-gray-800 hidden lg:block">
          <OrderBook currentPrice={currentPrice} />
        </div>

        {/* Center - Chart */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 p-4">
            <Card className="h-full bg-gray-800/50 border-gray-700">
              <PriceChart currentPrice={currentPrice} />
            </Card>
          </div>
          
          {/* Mobile Order Book & Recent Trades */}
          <div className="lg:hidden border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <OrderBook currentPrice={currentPrice} compact />
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <RecentTrades compact />
              </Card>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Panel & Recent Trades */}
        <div className="w-80 min-w-80 max-w-80 border-l border-gray-800 hidden lg:flex flex-col">
          <div className="flex-1 max-h-[50vh] border-b border-gray-800 overflow-hidden">
            <OrderPanel currentPrice={currentPrice} />
          </div>
          <div className="flex-1 max-h-[50vh] overflow-hidden">
            <RecentTrades />
          </div>
        </div>
      </div>

      {/* Mobile Order Panel */}
      <div className="lg:hidden border-t border-gray-800">
        <OrderPanel currentPrice={currentPrice} mobile />
      </div>
    </div>
  );
};

export default Index;
