// Hook for monitoring performance metrics

import { useEffect, useState, useCallback } from 'react';
import {
  getGlobalPerformanceMonitor,
  PerformanceMetrics,
  PerformanceThresholds,
} from '@/lib/performance/performance-monitor';

export interface UsePerformanceMonitorOptions {
  enabled?: boolean; // Enable monitoring (default: true)
  thresholds?: PerformanceThresholds;
  onLowFPS?: (metrics: PerformanceMetrics) => void;
  onCriticalFPS?: (metrics: PerformanceMetrics) => void;
}

/**
 * Hook for monitoring performance metrics
 */
export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const { enabled = true, thresholds, onLowFPS, onCriticalFPS } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => {
    const monitor = getGlobalPerformanceMonitor(thresholds);
    return monitor.getMetrics();
  });

  useEffect(() => {
    if (!enabled) return;

    const monitor = getGlobalPerformanceMonitor(thresholds);

    // Subscribe to updates
    const unsubscribe = monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);

      // Trigger callbacks
      if (onLowFPS && monitor.isLowFPS()) {
        onLowFPS(newMetrics);
      }
      if (onCriticalFPS && monitor.isCriticalFPS()) {
        onCriticalFPS(newMetrics);
      }
    });

    // Start monitoring
    monitor.start();

    // Cleanup
    return () => {
      unsubscribe();
      // Don't stop the monitor as it might be used by other components
    };
  }, [enabled, thresholds, onLowFPS, onCriticalFPS]);

  return metrics;
}

/**
 * Hook for getting current FPS
 */
export function useFPS(options: Pick<UsePerformanceMonitorOptions, 'enabled' | 'thresholds'> = {}) {
  const { enabled = true, thresholds } = options;
  const [fps, setFPS] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const monitor = getGlobalPerformanceMonitor(thresholds);

    const unsubscribe = monitor.subscribe((metrics) => {
      setFPS(metrics.fps);
    });

    monitor.start();

    return unsubscribe;
  }, [enabled, thresholds]);

  return fps;
}

/**
 * Hook for detecting low-end devices
 */
export function useIsLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(() => {
    const monitor = getGlobalPerformanceMonitor();
    return monitor.isLowEndDevice();
  });

  useEffect(() => {
    const monitor = getGlobalPerformanceMonitor();
    setIsLowEnd(monitor.isLowEndDevice());
  }, []);

  return isLowEnd;
}

/**
 * Hook for performance-aware rendering
 * Returns whether to render high-quality or low-quality version
 */
export function usePerformanceAwareRendering(options: UsePerformanceMonitorOptions = {}) {
  const metrics = usePerformanceMonitor(options);
  const [shouldReduceQuality, setShouldReduceQuality] = useState(false);

  useEffect(() => {
    const monitor = getGlobalPerformanceMonitor();

    // Reduce quality if:
    // - Low-end device
    // - Low FPS
    // - Critical FPS
    const reduce =
      metrics.isLowEndDevice || monitor.isLowFPS() || monitor.isCriticalFPS();

    setShouldReduceQuality(reduce);
  }, [metrics]);

  return {
    shouldReduceQuality,
    metrics,
    isLowEndDevice: metrics.isLowEndDevice,
    fps: metrics.fps,
  };
}

/**
 * Hook for adaptive quality based on performance
 */
export function useAdaptiveQuality() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const metrics = usePerformanceMonitor();

  useEffect(() => {
    const monitor = getGlobalPerformanceMonitor();

    if (monitor.isCriticalFPS() || metrics.isLowEndDevice) {
      setQuality('low');
    } else if (monitor.isLowFPS()) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, [metrics]);

  return quality;
}

/**
 * Hook for getting performance report
 */
export function usePerformanceReport(): string {
  const [report, setReport] = useState('');

  const generateReport = useCallback(() => {
    const monitor = getGlobalPerformanceMonitor();
    setReport(monitor.getReport());
  }, []);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  return report;
}
