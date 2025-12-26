
import React, { useState, useEffect } from 'react';
import { WhaleAlert } from '../types';
import { HYPE_PARAMS, EXPLORER_URL } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BotSimulator: React.FC = () => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [currentPrice, setCurrentPrice] = useState(35.00);
  const [history, setHistory] = useState<{time: string, price: number}[]>([]);

  useEffect(() => {
    // Simulate price movement
    const priceInterval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.15; // Slightly increased volatility for better visuals
        const newPrice = prev + change;
        setHistory(h => [...h.slice(-19), { time: new Date().toLocaleTimeString(), price: newPrice }]);
        return newPrice;
      });
    }, 3000);

    // Simulate alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const amount = Math.floor(Math.random() * 20000) + 500;
        let type: WhaleAlert['type'] = 'small_fish';
        if (amount >= HYPE_PARAMS.thresholds.whale) type = 'whale';
        else if (amount >= HYPE_PARAMS.thresholds.dolphin) type = 'dolphin';

        const newAlert: WhaleAlert = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          amount,
          price: currentPrice,
          from: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
          to: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
          timestamp: Date.now(),
          txHash: `0x${Math.random().toString(16).repeat(8).substr(0, 64)}`
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      }
    }, 5000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(alertInterval);
    };
  }, [currentPrice]);

  const getTypeStyle = (type: WhaleAlert['type']) => {
    switch (type) {
      case 'whale': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'dolphin': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getEmoji = (type: WhaleAlert['type']) => {
    switch (type) {
      case 'whale': return '🐋';
      case 'dolphin': return '🐬';
      default: return '🐟';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-gray-800 shadow-lg">
          <p className="text-gray-400 text-sm">HYPE Current Price</p>
          <p className="text-2xl font-bold text-white mono">${currentPrice.toFixed(4)}</p>
          <p className="text-xs text-green-400 mt-1">Source: Precompile 0x...0808</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-gray-800 shadow-lg">
          <p className="text-gray-400 text-sm">Monitoring Asset</p>
          <p className="text-xl font-bold text-white">WHYPE</p>
          <p className="text-xs text-gray-500 mono overflow-hidden text-ellipsis">{HYPE_PARAMS.whypeAddress}</p>
        </div>
        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-gray-800 shadow-lg">
          <p className="text-gray-400 text-sm">QuickNode Webhook Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xl font-bold text-white">Active</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">Latency: 42ms</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#1a1f2e] p-6 rounded-xl border border-gray-800 h-64">
        <h3 className="text-gray-400 mb-4 text-sm font-medium">HYPE Price Action (Simulation)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Feed */}
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1c2333]">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="mr-2">🚨</span> Real-time Whale Alerts
          </h3>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Last 50 Events</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Waiting for events from HyperEVM...</p>
              <div className="w-12 h-1 bg-gray-700 mt-4 overflow-hidden">
                <div className="w-full h-full bg-blue-500 animate-[loading_1.5s_infinite]"></div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-[#242c3d] transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 px-2 py-0.5 rounded border text-xs font-bold uppercase ${getTypeStyle(alert.type)}`}>
                        {alert.type.replace('_', ' ')}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {getEmoji(alert.type)} <span className="text-blue-400">{alert.amount.toLocaleString()} HYPE</span> Transferred
                        </div>
                        <div className="text-xs text-gray-500 mt-1 space-x-2">
                          <span className="mono">From: {alert.from}</span>
                          <span className="text-gray-700">|</span>
                          <span className="mono">To: {alert.to}</span>
                        </div>
                        <div className="mt-2 flex space-x-4 text-[10px] text-gray-500 uppercase tracking-wider">
                          <span>Value: ${(alert.amount * alert.price).toLocaleString()}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <a 
                      href={`${EXPLORER_URL}/tx/${alert.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400 p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default BotSimulator;
