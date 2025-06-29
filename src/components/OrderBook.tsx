
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderBookProps {
  currentPrice: number;
  compact?: boolean;
}

interface Order {
  price: number;
  quantity: number;
  total: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ currentPrice, compact = false }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  // Generate mock order book data
  useEffect(() => {
    const generateOrders = () => {
      const newBids: Order[] = [];
      const newAsks: Order[] = [];
      
      // Generate bids (buy orders) - decreasing price
      for (let i = 0; i < 15; i++) {
        const price = currentPrice - (i + 1) * (Math.random() * 2 + 0.5);
        const quantity = Math.random() * 5 + 0.1;
        newBids.push({
          price,
          quantity,
          total: price * quantity
        });
      }

      // Generate asks (sell orders) - increasing price
      for (let i = 0; i < 15; i++) {
        const price = currentPrice + (i + 1) * (Math.random() * 2 + 0.5);
        const quantity = Math.random() * 5 + 0.1;
        newAsks.push({
          price,
          quantity,
          total: price * quantity
        });
      }

      setBids(newBids);
      setAsks(newAsks);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 5000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const maxDepth = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  const OrderRow: React.FC<{ order: Order; type: 'bid' | 'ask' }> = ({ order, type }) => {
    const depthPercent = (order.total / maxDepth) * 100;
    
    return (
      <div className="relative group hover:bg-gray-700/30 transition-colors">
        <div 
          className={`absolute inset-0 ${type === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          style={{ width: `${depthPercent}%` }}
        />
        <div className="relative flex justify-between items-center py-1 px-2 text-xs font-mono">
          <span className={type === 'bid' ? 'text-green-500' : 'text-red-500'}>
            {order.price.toFixed(2)}
          </span>
          <span className="text-gray-300">
            {order.quantity.toFixed(4)}
          </span>
          <span className="text-gray-400">
            {order.total.toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <div className="py-3 px-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Order Book</h3>
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 min-h-0">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-px">
            {asks.slice().reverse().slice(0, compact ? 8 : 15).map((ask, index) => (
              <OrderRow key={`ask-${index}`} order={ask} type="ask" />
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="py-2 px-3 border-y border-gray-600 bg-gray-700/30 flex-shrink-0">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-mono font-bold">
              ${currentPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">Current Price</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-px">
            {bids.slice(0, compact ? 8 : 15).map((bid, index) => (
              <OrderRow key={`bid-${index}`} order={bid} type="bid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
