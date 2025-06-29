
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wallet, Copy, ExternalLink, LogOut, Zap } from 'lucide-react';

const WalletConnection: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress] = useState('0x742d35Cc6425C0532b32F98fCAfCd34E5a2b8C78');
  const [balances] = useState({
    ETH: 5.2431,
    USDT: 12450.80
  });
  const [network] = useState('Ethereum Mainnet');

  const handleConnect = async () => {
    // Mock wallet connection
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-gray-600 bg-gray-800/50 hover:bg-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800 border-gray-700" align="end">
        <Card className="border-0 bg-transparent">
          <CardContent className="p-4 space-y-4">
            {/* Wallet Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Connected to</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-500">{network}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="h-8 w-8 p-0 hover:bg-gray-600"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-gray-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Balances */}
            <div className="space-y-2">
              <span className="text-sm text-gray-400">Balances</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">ETH</span>
                  <span className="text-sm font-mono">{balances.ETH.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">USDT</span>
                  <span className="text-sm font-mono">${balances.USDT.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Gas Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Gas Tracker</span>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-500">12 Gwei</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-green-500">Slow</div>
                  <div>8 Gwei</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded border border-yellow-500/50">
                  <div className="text-yellow-500">Standard</div>
                  <div>12 Gwei</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-red-500">Fast</div>
                  <div>18 Gwei</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-gray-700">
              <Button
                onClick={handleDisconnect}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default WalletConnection;
