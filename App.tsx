
import React from 'react';
import Layout from './components/Layout';
import BotSimulator from './components/BotSimulator';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <BotSimulator />
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>
    </Layout>
  );
};

export default App;
