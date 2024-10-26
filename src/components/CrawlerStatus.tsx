import React from 'react';

interface CrawlerStatusProps {
  status: 'idle' | 'crawling' | 'completed' | 'error';
  saveDir: string;
}

export function CrawlerStatus({ status, saveDir }: CrawlerStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'crawling':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Ready to start crawling';
      case 'crawling':
        return 'Crawling in progress...';
      case 'completed':
        return 'Crawling completed successfully';
      case 'error':
        return 'An error occurred during crawling';
      default:
        return '';
    }
  };

  return (
    <div className="mt-6">
      <div className={`text-sm ${getStatusColor()}`}>
        Status: {getStatusMessage()}
      </div>
      {saveDir && status === 'completed' && (
        <div className="mt-2 text-sm text-gray-600">
          Save Directory: {saveDir}
        </div>
      )}
    </div>
  );
}