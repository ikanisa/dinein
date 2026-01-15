/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and reports to analytics and Sentry.
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';
import { trackEvent } from './analytics';
import * as Sentry from '@sentry/react';

export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Report Web Vitals to analytics and Sentry
 */
export function reportWebVitals(metric: Metric) {
  const metricData = {
    name: metric.name,
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
  };

  // Send to analytics
  trackEvent('web_vital', metricData);

  // Send to Sentry as measurement (for performance monitoring)
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    try {
      Sentry.metrics.distribution(metric.name, metric.value, {
        unit: metric.name === 'CLS' ? 'ratio' : 'millisecond',
        tags: {
          rating: metric.rating,
          navigationType: metric.navigationType || 'unknown',
        },
      });

      // Log poor ratings as breadcrumbs for debugging
      if (metric.rating === 'poor') {
        Sentry.addBreadcrumb({
          category: 'web-vital',
          message: `${metric.name} is poor: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`,
          level: 'warning',
          data: metricData,
        });
      }
    } catch (error) {
      // Silently fail if Sentry is not initialized
      console.warn('Failed to send Web Vital to Sentry:', error);
    }
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export async function initWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    // Use the Metric type from web-vitals
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  } catch (error) {
    console.warn('Failed to initialize Web Vitals monitoring:', error);
  }
}

// Initialize on load
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    initWebVitals();
  });
}
