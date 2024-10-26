import React from 'react';
import { Switch } from '@headlessui/react';
import { CogIcon } from '@heroicons/react/24/outline';
import type { CrawlerConfig as ConfigType } from '../types/crawler';

interface CrawlerConfigProps {
  config: ConfigType;
  onConfigChange: (config: ConfigType) => void;
  disabled: boolean;
}

export function CrawlerConfig({ config, onConfigChange, disabled }: CrawlerConfigProps) {
  const handleToggle = (key: keyof ConfigType) => {
    if (disabled) return;
    onConfigChange({
      ...config,
      [key]: typeof config[key] === 'boolean' ? !config[key] : config[key]
    });
  };

  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      onConfigChange({
        ...config,
        maxDepth: value
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-4">
        <CogIcon className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-medium text-gray-900">Crawler Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="maxDepth" className="block text-sm font-medium text-gray-700">
            Maximum Crawl Depth
          </label>
          <input
            type="number"
            id="maxDepth"
            min="1"
            max="10"
            value={config.maxDepth}
            onChange={handleDepthChange}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
          />
        </div>

        <SwitchOption
          enabled={config.includeImages}
          onChange={() => handleToggle('includeImages')}
          label="Include Images"
          disabled={disabled}
        />

        <SwitchOption
          enabled={config.includeStyles}
          onChange={() => handleToggle('includeStyles')}
          label="Include Stylesheets"
          disabled={disabled}
        />

        <SwitchOption
          enabled={config.includeScripts}
          onChange={() => handleToggle('includeScripts')}
          label="Include Scripts"
          disabled={disabled}
        />

        <SwitchOption
          enabled={config.downloadResources}
          onChange={() => handleToggle('downloadResources')}
          label="Download Resources"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

interface SwitchOptionProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
  disabled: boolean;
}

function SwitchOption({ enabled, onChange, label, disabled }: SwitchOptionProps) {
  return (
    <Switch.Group>
      <div className="flex items-center justify-between">
        <Switch.Label className="text-sm text-gray-700">{label}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className={`${
            enabled ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}