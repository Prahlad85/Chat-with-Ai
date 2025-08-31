import React, { useState } from 'react';
import { summarizeText } from '../services/geminiService';
import { SummarizeIcon, DocumentIcon } from './icons/Icons';

const SummarizerView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please paste some text to summarize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await summarizeText(inputText);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50">
      <header className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-100">Text Summarizer</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Text Area */}
          <div className="flex flex-col">
            <label htmlFor="inputText" className="text-gray-300 font-medium mb-2 flex items-center gap-2">
              <DocumentIcon />
              Your Text
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long text, article, or document here..."
              disabled={isLoading}
              className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[300px]"
            ></textarea>
          </div>

          {/* Summary Display Area */}
          <div className="flex flex-col">
            <label htmlFor="summaryOutput" className="text-gray-300 font-medium mb-2 flex items-center gap-2">
              <SummarizeIcon />
               AI Summary
            </label>
            <div
              id="summaryOutput"
              className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-gray-200 min-h-[300px] prose prose-invert prose-sm max-w-none"
            >
              {isLoading && <div className="text-gray-400">Summarizing...</div>}
              {summary && <p>{summary}</p>}
              {!isLoading && !summary && <p className="text-gray-500">Your summary will appear here.</p>}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 text-center">
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all duration-200"
            >
                <SummarizeIcon />
                {isLoading ? 'Processing...' : 'Summarize Text'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SummarizerView;
