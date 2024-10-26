import React, { useMemo } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import bytes from 'bytes';
import type { Resource } from '../types/crawler';

interface StatsPanelProps {
  resources: Resource[];
}

export function StatsPanel({ resources }: StatsPanelProps) {
  const stats = useMemo(() => {
    const typeBreakdown = resources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);

    return {
      totalFiles: resources.length,
      totalSize,
      typeBreakdown
    };
  }, [resources]);

  if (resources.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-4">
        <ChartBarIcon className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-medium text-gray-900">Crawling Statistics</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Total Files</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalFiles}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Size</p>
          <p className="text-2xl font-semibold text-gray-900">{bytes(stats.totalSize)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Resource Types</p>
          <div className="space-y-2">
            {Object.entries(stats.typeBreakdown).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">{type}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}