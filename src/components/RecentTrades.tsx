
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
}

interface RecentTradesProps {
  compact?: boolean;
}

const RecentTrades: React.FC<RecentTradesProps> = ({ compact = false }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // Generate initial trades
    const generateTrades = () => {
      const newTrades: Trade[] = [];
      const basePrice = 2024.50;
      
      for (let i = 0; i < 50; i++) {
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const price = basePrice + (Math.random() - 0.5) * 20;
        const amount = Math.random() * 2 + 0.01;
        const timestamp = new Date(Date.now() - i * 1000 * Math.random() * 60);
        
        newTrades.push({
          id: `trade-${i}`,
          side,
          amount,
          price,
          timestamp
        });
      }
      
      return newTrades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setTrades(generateTrades());

    // Simulate new trades
    const interval = setInterval(() => {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = 2024.50 + (Math.random() - 0.5) * 20;
      const amount = Math.random() * 2 + 0.01;
      
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        side,
        amount,
        price,
        timestamp: new Date()
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const TradeRow: React.FC<{ trade: Trade }> = ({ trade }) => (
    <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-700/30 transition-colors">
      <div className="flex items-center space-x-2">
        {trade.side === 'buy' ? (
          <TrendingUp className="h-3 w-3 text-green-500" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-500" />
        )}
        <span className="text-xs font-mono text-gray-300">
          {trade.amount.toFixed(4)}
        </span>
      </div>
      
      <span className={`text-xs font-mono ${
        trade.side === 'buy' ? 'text-green-500' : 'text-red-500'
      }`}>
        {trade.price.toFixed(2)}
      </span>
      
      <span className="text-xs text-gray-500 font-mono">
        {formatTime(trade.timestamp)}
      </span>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <div className="py-3 px-4 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Trades</h3>
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>Amount</span>
          <span>Price</span>
          <span>Time</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-px">
          {trades.slice(0, compact ? 15 : 30).map((trade) => (
            <TradeRow key={trade.id} trade={trade} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;
