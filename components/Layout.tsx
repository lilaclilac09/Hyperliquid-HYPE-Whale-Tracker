
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            HYPE Whale Bot
          </h1>
          <p className="text-xs text-gray-400 mt-1">HyperEVM Monitor</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <div
            className="w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Live Dashboard
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>HyperEVM Mainnet Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto bg-[#0b0e14]">
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#111827] border-b border-gray-800">
          <h1 className="font-bold text-blue-400">HYPE Whale Bot</h1>
          <div className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded border border-green-500/20">
            LIVE
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default Layout;
