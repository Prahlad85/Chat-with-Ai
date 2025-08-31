import React, { useState } from 'react';
import { generateImages } from '../services/geminiService';
import { MagicWandIcon } from './icons/Icons';

const ImageGeneratorView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const generatedImages = await generateImages(prompt);
      setImages(generatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50">
      <header className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-100">Image Generator</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., A cinematic shot of a raccoon in a library, award winning photography"
              disabled={isLoading}
              className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all duration-200"
            >
              <MagicWandIcon />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          
          {isLoading && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          )}

          {!isLoading && images.length === 0 && (
             <div className="text-center text-gray-400 pt-16">
                 <p className="text-lg">Let your imagination run wild.</p>
                 <p>Describe the image you want to create.</p>
             </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((src, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <img src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorView;
