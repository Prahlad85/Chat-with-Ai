import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession, streamChatMessage } from '../services/geminiService';
import { Message, MessageAuthor } from '../types';
import { SendIcon, UserIcon, GeminiIconSmall } from './icons/Icons';
import { marked } from 'marked';

// A simple component to render markdown
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const htmlContent = marked.parse(content);
  return <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />;
};


const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSession.current = createChatSession();
    setMessages([{ author: MessageAuthor.MODEL, text: 'Hello! How can I help you be creative today?' }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatSession.current) return;

    const userMessage: Message = { author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessage: Message = { author: MessageAuthor.MODEL, text: '' };
    setMessages(prev => [...prev, modelMessage]);

    try {
      const stream = await streamChatMessage(chatSession.current, input);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: fullResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error streaming message:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: 'Sorry, I encountered an error. Please try again.' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50">
      <header className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-100">Chat Assistant</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.author === MessageAuthor.USER ? 'justify-end' : ''}`}>
             {msg.author === MessageAuthor.MODEL && (
              <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-full flex items-center justify-center">
                <GeminiIconSmall />
              </div>
            )}
            <div className={`max-w-xl p-4 rounded-xl ${
                msg.author === MessageAuthor.USER
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}>
              <MarkdownRenderer content={msg.text} />
              {isLoading && msg.author === MessageAuthor.MODEL && messages.length - 1 === index && <span className="inline-block w-2 h-4 bg-white ml-1 animate-ping"></span>}
            </div>
            {msg.author === MessageAuthor.USER && (
              <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 pl-4 pr-12 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
