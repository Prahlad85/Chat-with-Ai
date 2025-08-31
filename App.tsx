import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ImageGeneratorView from './components/ImageGeneratorView';
import SummarizerView from './components/SummarizerView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatView />;
      case 'image':
        return <ImageGeneratorView />;
      case 'summarizer':
        return <SummarizerView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
