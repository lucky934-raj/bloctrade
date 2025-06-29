
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown } from 'lucide-react';

interface OrderPanelProps {
  currentPrice: number;
  mobile?: boolean;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ currentPrice, mobile = false }) => {
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState(currentPrice.toString());
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('0.00');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippage, setSlippage] = useState('0.1');
  const [expiry, setExpiry] = useState('GTC');

  // Update price when current price changes and it's a market order
  useEffect(() => {
    if (orderType === 'market') {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);

  // Calculate total when price or amount changes
  useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const amountNum = parseFloat(amount) || 0;
    setTotal((priceNum * amountNum).toFixed(2));
  }, [price, amount]);

  const handleOrderTypeChange = (type: string) => {
    setOrderType(type);
    if (type === 'market') {
      setPrice(currentPrice.toString());
    } else {
      // For limit orders, set to best bid/ask
      const bestPrice = side === 'buy' ? currentPrice - 1 : currentPrice + 1;
      setPrice(bestPrice.toString());
    }
  };

  const handleSubmit = () => {
    // Mock order submission
    console.log('Order submitted:', {
      type: orderType,
      side,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: parseFloat(total),
      slippage,
      expiry
    });
    
    // Reset form
    setAmount('');
    setTotal('0.00');
  };

  const balances = {
    ETH: 5.2431,
    USDT: 12450.80
  };

  return (
    <div className={`bg-gray-800/50 border-gray-700 h-full flex flex-col ${mobile ? 'rounded-none border-0' : 'border rounded-lg overflow-hidden'}`}>
      <div className="py-3 px-4 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-300">Place Order</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Order Type Tabs */}
          <Tabs value={orderType} onValueChange={handleOrderTypeChange}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
              <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={side === 'buy' ? 'default' : 'outline'}
              onClick={() => setSide('buy')}
              className={`${
                side === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700 border-green-600' 
                  : 'border-green-600 text-green-600 hover:bg-green-600/10'
              }`}
            >
              Buy
            </Button>
            <Button
              variant={side === 'sell' ? 'default' : 'outline'}
              onClick={() => setSide('sell')}
              className={`${
                side === 'sell' 
                  ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                  : 'border-red-600 text-red-600 hover:bg-red-600/10'
              }`}
            >
              Sell
            </Button>
          </div>

          {/* Price Input */}
          {orderType === 'limit' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Price (USDT)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white font-mono"
              />
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-gray-400">Amount (ETH)</label>
              <span className="text-xs text-gray-500">
                Balance: {side === 'buy' ? balances.USDT.toFixed(2) : balances.ETH.toFixed(4)} {side === 'buy' ? 'USDT' : 'ETH'}
              </span>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="bg-gray-700 border-gray-600 text-white font-mono"
            />
            <div className="flex space-x-1">
              {['25%', '50%', '75%', '100%'].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const maxAmount = side === 'buy' 
                      ? balances.USDT / parseFloat(price) 
                      : balances.ETH;
                    const percentValue = parseInt(percent) / 100;
                    setAmount((maxAmount * percentValue).toFixed(4));
                  }}
                  className="flex-1 text-xs border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  {percent}
                </Button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Total (USDT)</label>
            <div className="p-3 bg-gray-700 rounded-md text-white font-mono">
              {total}
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-white transition-colors">
              <span>Advanced Options</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Expiry Type</label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                    <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                    <SelectItem value="FOK">Fill or Kill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Slippage Tolerance (%)</label>
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  placeholder="0.1"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className={`w-full ${
              side === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} ETH
          </Button>

          {/* Estimated Gas Fee */}
          <div className="text-xs text-gray-500 text-center">
            Est. Gas Fee: ~$2.50 (12 Gwei)
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
