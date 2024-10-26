export type CrawlerStatus = 'idle' | 'crawling' | 'completed' | 'error';

export type ResourceType = 'stylesheet' | 'script' | 'image' | 'font' | 'other';
export type ResourceStatus = 'pending' | 'downloading' | 'downloaded' | 'error';

export interface Resource {
  url: string;
  type: ResourceType;
  status: ResourceStatus;
  size: number;
}

export interface CrawlerConfig {
  maxDepth: number;
  includeImages: boolean;
  includeStyles: boolean;
  includeScripts: boolean;
  downloadResources: boolean;
  antiDetection: AntiDetectionConfig;
}

export interface AntiDetectionConfig {
  location: LocationPreset;
  device: DevicePreset;
  browserProfile: BrowserProfile;
}

export type LocationPreset = 
  | 'auto'
  | 'korea-seoul'
  | 'korea-busan'
  | 'japan-tokyo'
  | 'china-beijing'
  | 'usa-west'
  | 'usa-east'
  | 'europe-west';

export type DevicePreset = 
  | 'auto'
  | 'desktop-windows'
  | 'desktop-mac'
  | 'mobile-android'
  | 'mobile-ios'
  | 'tablet-android'
  | 'tablet-ios';

export type BrowserProfile = 
  | 'standard'
  | 'stealth'
  | 'maximum';

export interface CrawlerStats {
  totalSize: number;
  totalFiles: number;
  typeBreakdown: Record<ResourceType, number>;
}