import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CrawlerForm } from './components/CrawlerForm';
import { CrawlerStatus } from './components/CrawlerStatus';
import { ResourceList } from './components/ResourceList';
import { CrawlerConfig } from './components/CrawlerConfig';
import { AdvancedConfig } from './components/AdvancedConfig';
import { StatsPanel } from './components/StatsPanel';
import { ConsoleViewer } from './components/ConsoleViewer';
import type { Resource, CrawlerStatus as StatusType, CrawlerConfig as ConfigType } from './types/crawler';

export default function App() {
  const [crawlingStatus, setCrawlingStatus] = useState<StatusType>('idle');
  const [resources, setResources] = useState<Resource[]>([]);
  const [saveDir, setSaveDir] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [config, setConfig] = useState<ConfigType>({
    maxDepth: 2,
    includeImages: true,
    includeStyles: true,
    includeScripts: true,
    downloadResources: true,
    antiDetection: {
      location: 'auto',
      device: 'auto',
      browserProfile: 'standard'
    }
  });

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleStartCrawling = async (url: string) => {
    if (!url.startsWith('http')) {
      alert('Please enter a valid URL starting with http or https');
      return;
    }

    setCrawlingStatus('crawling');
    setResources([]);
    setLogs([]);
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const newSaveDir = `/website_backup_${timestamp}`;
      setSaveDir(newSaveDir);
      addLog(`Starting crawler for ${url}`);
      addLog(`Using location: ${config.antiDetection.location}`);
      addLog(`Device profile: ${config.antiDetection.device}`);
      addLog(`Protection level: ${config.antiDetection.browserProfile}`);

      // Simulate resource discovery for now
      setTimeout(() => {
        const mockResources: Resource[] = [
          {
            url: `${url}/styles.css`,
            type: 'stylesheet',
            status: 'downloaded',
            size: 15000
          },
          {
            url: `${url}/main.js`,
            type: 'script',
            status: 'downloaded',
            size: 45000
          },
          {
            url: `${url}/logo.png`,
            type: 'image',
            status: 'downloaded',
            size: 25000
          }
        ];
        
        mockResources.forEach(resource => {
          setResources(prev => [...prev, resource]);
          addLog(`Found resource: ${resource.url}`);
        });
        
        setCrawlingStatus('completed');
        addLog('Crawling completed successfully');
      }, 2000);
    } catch (error) {
      setCrawlingStatus('error');
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Crawling failed:', error);
    }
  };

  const handleConfigChange = (newConfig: Partial<ConfigType>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Website Resource Crawler
                </h1>
                <button
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {isConsoleOpen ? 'Hide Console' : 'Show Console'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <CrawlerForm 
                      onSubmit={handleStartCrawling}
                      disabled={crawlingStatus === 'crawling'}
                    />

                    <CrawlerStatus 
                      status={crawlingStatus}
                      saveDir={saveDir}
                    />
                  </div>

                  {resources.length > 0 && (
                    <ResourceList resources={resources} />
                  )}
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-4 rounded-lg shadow space-y-6">
                    <CrawlerConfig
                      config={config}
                      onConfigChange={handleConfigChange}
                      disabled={crawlingStatus === 'crawling'}
                    />
                    
                    <AdvancedConfig
                      config={config.antiDetection}
                      onConfigChange={(antiDetection) => handleConfigChange({ antiDetection })}
                      disabled={crawlingStatus === 'crawling'}
                    />
                  </div>
                  
                  <StatsPanel resources={resources} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsoleViewer 
        logs={logs}
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />
    </div>
  );
}