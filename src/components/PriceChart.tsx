import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  currentPrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ currentPrice }) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    // Generate mock price data
    const generateData = () => {
      const dataPoints = timeframe === '1m' ? 60 : timeframe === '1h' ? 24 : 30;
      const labels = [];
      const prices = [];
      
      let basePrice = currentPrice;
      
      for (let i = dataPoints; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 50;
        basePrice = Math.max(1800, basePrice + variation);
        prices.push(basePrice);
        
        if (timeframe === '1m') {
          labels.push(`${i}m`);
        } else if (timeframe === '1h') {
          labels.push(`${i}h`);
        } else {
          labels.push(`${i}d`);
        }
      }
      
      return {
        labels: labels.reverse(),
        datasets: [
          {
            label: 'ETH Price',
            data: prices.reverse(),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#3B82F6',
            pointHoverBorderColor: '#1E40AF',
            pointHoverBorderWidth: 2,
          },
        ],
      };
    };

    setChartData(generateData());
  }, [timeframe, currentPrice]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const timeframes = [
    { label: '1M', value: '1m' },
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">ETH/USDT</h3>
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-gray-400">Volume: <span className="text-white">1,234.56 ETH</span></div>
          <div className="text-gray-400">24h High: <span className="text-green-500">${(currentPrice + 50).toFixed(2)}</span></div>
          <div className="text-gray-400">24h Low: <span className="text-red-500">${(currentPrice - 80).toFixed(2)}</span></div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;
