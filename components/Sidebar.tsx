import React from 'react';
import type { View } from '../types';
import { ChatIcon, ImageIcon, SummarizeIcon, GeminiIcon } from './icons/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { id: View; name: string; icon: JSX.Element }[] = [
    { id: 'chat', name: 'Chat Assistant', icon: <ChatIcon /> },
    { id: 'image', name: 'Image Generator', icon: <ImageIcon /> },
    { id: 'summarizer', name: 'Text Summarizer', icon: <SummarizeIcon /> },
  ];

  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <GeminiIcon />
        <h1 className="text-xl font-bold text-gray-50">Creative Assistant</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Powered by Gemini API | Developed by Prahlad Prajapati</p>
      </div>
    </aside>
  );
};

export default Sidebar;
