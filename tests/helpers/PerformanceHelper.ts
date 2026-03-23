import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface PerformanceMetrics {
  url: string;
  timestamp: string;
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  networkRequests: number;
  totalTransferSize: number;
  memoryUsage?: number;
}

export class PerformanceHelper {
  private page: Page;
  private metrics: PerformanceMetrics[] = [];
  private metricsFile: string;

  constructor(page: Page) {
    this.page = page;
    this.metricsFile = path.join(process.cwd(), 'test-results', 'performance-metrics.json');
    this.ensureDir(path.dirname(this.metricsFile));
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Capture performance metrics for current page
   */
  async captureMetrics(label?: string): Promise<PerformanceMetrics> {
    const performanceData = await this.page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint,
        firstContentfulPaint,
        networkRequests: resources.length,
        totalTransferSize: totalSize,
      };
    });

    const metrics: PerformanceMetrics = {
      url: this.page.url(),
      timestamp: new Date().toISOString(),
      ...performanceData,
    };

    this.metrics.push(metrics);
    
    // Display metrics on page
    await this.displayMetricsOnPage(metrics, label);
    
    return metrics;
  }

  /**
   * Display performance metrics overlay on the page
   */
  private async displayMetricsOnPage(metrics: PerformanceMetrics, label?: string) {
    await this.page.evaluate(({ metrics, label }) => {
      let overlay = document.getElementById('perf-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'perf-overlay';
        overlay.style.cssText = `
          position: fixed;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: #00ff00;
          padding: 15px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 11px;
          z-index: 999999;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          min-width: 280px;
        `;
        document.body.appendChild(overlay);
      }

      overlay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; font-size: 12px; border-bottom: 1px solid rgba(0, 255, 0, 0.3); padding-bottom: 5px; color: #00ff00;">
          Performance Metrics ${label ? `- ${label}` : ''}
        </div>
        <div style="line-height: 1.6;">
          <div>Load Time: <strong>${metrics.loadTime}ms</strong></div>
          <div>DOM Content Loaded: <strong>${metrics.domContentLoaded}ms</strong></div>
          <div>First Paint: <strong>${metrics.firstPaint.toFixed(2)}ms</strong></div>
          <div>First Contentful Paint: <strong>${metrics.firstContentfulPaint.toFixed(2)}ms</strong></div>
          <div>Network Requests: <strong>${metrics.networkRequests}</strong></div>
          <div>Total Transfer: <strong>${(metrics.totalTransferSize / 1024).toFixed(2)} KB</strong></div>
        </div>
      `;


      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (overlay) overlay.style.opacity = '0.3';
      }, 3000);
    }, { metrics, label });
  }

  /**
   * Save all metrics to file
   */
  async saveMetrics() {
    if (this.metrics.length > 0) {
      const existingData = fs.existsSync(this.metricsFile) 
        ? JSON.parse(fs.readFileSync(this.metricsFile, 'utf-8')) 
        : [];
      
      const allMetrics = [...existingData, ...this.metrics];
      fs.writeFileSync(this.metricsFile, JSON.stringify(allMetrics, null, 2));
      
      console.log(`Performance metrics saved: ${this.metrics.length} entries`);
    }
  }

  /**
   * Monitor network activity with visual indicator
   */
  async monitorNetwork() {
    await this.page.evaluate(() => {
      let requestCount = 0;
      let indicator = document.getElementById('network-indicator');
      
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'network-indicator';
        indicator.style.cssText = `
          position: fixed;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: #00ff00;
          padding: 8px 12px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 8px;
        `;
        document.body.appendChild(indicator);
      }

      const updateIndicator = () => {
        if (indicator) {
          indicator.innerHTML = `
            <span style="animation: pulse 1s infinite;">*</span>
            <span>Network Requests: ${requestCount}</span>
          `;
        }
      };

      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);

      // Intercept fetch
      const originalFetch = window.fetch;
      (window as any).fetch = function(...args: any[]) {
        requestCount++;
        updateIndicator();
        return originalFetch.apply(this, args as [RequestInfo | URL, RequestInit?]);
      };

      // Intercept XMLHttpRequest
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(...args: any[]) {
        requestCount++;
        updateIndicator();
        return originalOpen.apply(this, args as [string, string, boolean]);
      };

      updateIndicator();
    });
  }
}

