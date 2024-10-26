import React, { useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface CrawlerFormProps {
  onSubmit: (url: string) => void;
  disabled: boolean;
}

export function CrawlerForm({ onSubmit, disabled }: CrawlerFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Target URL
        </label>
        <div className="mt-2 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="url"
            name="url"
            id="url"
            className={clsx(
              "block w-full pl-10 pr-12 border-gray-300 rounded-lg",
              "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              "text-sm transition-colors duration-200",
              disabled && "bg-gray-50 cursor-not-allowed"
            )}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled}
        className={clsx(
          "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg",
          "text-sm font-medium text-white transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
        )}
      >
        {disabled ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Crawling...
          </>
        ) : (
          'Start Crawling'
        )}
      </button>
    </form>
  );
}