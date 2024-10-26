import { chromium } from '@playwright/test';
import type { Resource, CrawlerConfig, LocationPreset, DevicePreset } from '../types/crawler';

const LOCATION_COORDS: Record<LocationPreset, [number, number]> = {
  'auto': [0, 0],
  'korea-seoul': [37.5665, 126.9780],
  'korea-busan': [35.1796, 129.0756],
  'japan-tokyo': [35.6762, 139.6503],
  'china-beijing': [39.9042, 116.4074],
  'usa-west': [37.7749, -122.4194],
  'usa-east': [40.7128, -74.0060],
  'europe-west': [48.8566, 2.3522],
};

const DEVICE_CONFIGS: Record<DevicePreset, { userAgent: string; viewport: { width: number; height: number } }> = {
  'auto': {
    userAgent: '',
    viewport: { width: 1280, height: 800 }
  },
  'desktop-windows': {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  },
  'desktop-mac': {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  },
  'mobile-android': {
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
    viewport: { width: 412, height: 915 }
  },
  'mobile-ios': {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 }
  },
  'tablet-android': {
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1600, height: 2560 }
  },
  'tablet-ios': {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    viewport: { width: 1024, height: 1366 }
  }
};

export async function startCrawling(
  url: string,
  config: CrawlerConfig,
  onResourceFound: (resource: Resource) => void
): Promise<void> {
  const { location, device, browserProfile } = config.antiDetection;
  const coords = LOCATION_COORDS[location];
  const deviceConfig = DEVICE_CONFIGS[device];

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      browserProfile === 'maximum' ? '--disable-web-security' : '',
    ]
  });

  try {
    const context = await browser.newContext({
      viewport: deviceConfig.viewport,
      userAgent: deviceConfig.userAgent || undefined,
      locale: location.includes('korea') ? 'ko-KR' : 'en-US',
      geolocation: { latitude: coords[0], longitude: coords[1] },
      permissions: ['geolocation'],
      extraHTTPHeaders: {
        'Accept-Language': location.includes('korea') ? 'ko-KR,ko;q=0.9' : 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        ...(browserProfile === 'maximum' ? {
          'Sec-Ch-Ua': '"Chromium";v="91", " Not;A Brand";v="99"',
          'Sec-Ch-Ua-Mobile': device.includes('mobile') ? '?1' : '?0',
          'Sec-Ch-Ua-Platform': device.includes('windows') ? 'Windows' : device.includes('mac') ? 'macOS' : 'Android',
        } : {})
      }
    });

    if (browserProfile === 'stealth' || browserProfile === 'maximum') {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        window.chrome = { runtime: {} };
      });
    }

    const page = await context.newPage();
    const cdpSession = await context.newCDPSession(page);

    await cdpSession.send('Network.enable');
    cdpSession.on('Network.requestWillBeSent', async (params) => {
      const resourceUrl = params.request.url;
      
      if (!resourceUrl.startsWith('data:') && !resourceUrl.startsWith('chrome-extension:')) {
        const type = getResourceType(params.request.resourceType);
        
        if (shouldIncludeResource(type, config)) {
          const resource: Resource = {
            url: resourceUrl,
            type,
            status: 'downloading',
            size: parseInt(params.request.headers['content-length'] || '0', 10)
          };
          
          onResourceFound(resource);
        }
      }
    });

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } finally {
    await browser.close();
  }
}

function getResourceType(type: string): Resource['type'] {
  switch (type) {
    case 'stylesheet':
      return 'stylesheet';
    case 'script':
      return 'script';
    case 'image':
      return 'image';
    case 'font':
      return 'font';
    default:
      return 'other';
  }
}

function shouldIncludeResource(type: Resource['type'], config: CrawlerConfig): boolean {
  switch (type) {
    case 'image':
      return config.includeImages;
    case 'stylesheet':
      return config.includeStyles;
    case 'script':
      return config.includeScripts;
    default:
      return true;
  }
}