import React from 'react';
import { DocumentIcon, PhotoIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import bytes from 'bytes';
import type { Resource } from '../types/crawler';

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-5 w-5 text-gray-400" />;
      case 'script':
        return <CodeBracketIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'text-green-600 bg-green-100';
      case 'downloading':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Captured Resources</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {resources.map((resource, index) => (
            <li key={index}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    {getIcon(resource.type)}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resource.url}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {bytes(resource.size)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}