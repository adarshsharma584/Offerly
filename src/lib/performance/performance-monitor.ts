// Performance monitoring utilities for tracking FPS and device capabilities

export interface PerformanceMetrics {
  fps: number;
  frameTime: number; // Average frame time in ms
  droppedFrames: number;
  totalFrames: number;
  isLowEndDevice: boolean;
  cpuCores: number;
  deviceMemory: number; // In GB
  connectionType: string;
}

export interface PerformanceThresholds {
  targetFPS?: number; // Target FPS (default: 60)
  lowFPSThreshold?: number; // FPS below this is considered low (default: 50)
  criticalFPSThreshold?: number; // FPS below this is critical (default: 30)
  sampleSize?: number; // Number of frames to average (default: 60)
}

type PerformanceCallback = (metrics: PerformanceMetrics) => void;

export class PerformanceMonitor {
  private isRunning = false;
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private frameTimes: number[] = [];
  private droppedFrames = 0;
  private totalFrames = 0;
  private callbacks: Set<PerformanceCallback> = new Set();
  private thresholds: Required<PerformanceThresholds>;
  private metrics: PerformanceMetrics;

  constructor(thresholds: PerformanceThresholds = {}) {
    this.thresholds = {
      targetFPS: thresholds.targetFPS ?? 60,
      lowFPSThreshold: thresholds.lowFPSThreshold ?? 50,
      criticalFPSThreshold: thresholds.criticalFPSThreshold ?? 30,
      sampleSize: thresholds.sampleSize ?? 60,
    };

    this.metrics = {
      fps: 0,
      frameTime: 0,
      droppedFrames: 0,
      totalFrames: 0,
      isLowEndDevice: this.detectLowEndDevice(),
      cpuCores: this.getCPUCores(),
      deviceMemory: this.getDeviceMemory(),
      connectionType: this.getConnectionType(),
    };

    this.update = this.update.bind(this);
  }

  /**
   * Start monitoring performance
   */
  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;

    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.rafId = requestAnimationFrame(this.update);
  }

  /**
   * Stop monitoring performance
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Update performance metrics
   */
  private update(currentTime: number): void {
    if (!this.isRunning) return;

    // Calculate frame time
    const frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Track frame times
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.thresholds.sampleSize) {
      this.frameTimes.shift();
    }

    // Count dropped frames (frame time > target frame time)
    const targetFrameTime = 1000 / this.thresholds.targetFPS;
    if (frameTime > targetFrameTime * 1.5) {
      this.droppedFrames++;
    }

    this.totalFrames++;

    // Calculate metrics
    const avgFrameTime =
      this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
    const fps = Math.round(1000 / avgFrameTime);

    this.metrics = {
      fps,
      frameTime: Math.round(avgFrameTime * 100) / 100,
      droppedFrames: this.droppedFrames,
      totalFrames: this.totalFrames,
      isLowEndDevice: this.metrics.isLowEndDevice,
      cpuCores: this.metrics.cpuCores,
      deviceMemory: this.metrics.deviceMemory,
      connectionType: this.getConnectionType(),
    };

    // Notify callbacks
    this.callbacks.forEach((callback) => {
      callback(this.metrics);
    });

    // Continue monitoring
    this.rafId = requestAnimationFrame(this.update);
  }

  /**
   * Subscribe to performance updates
   */
  public subscribe(callback: PerformanceCallback): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current FPS
   */
  public getFPS(): number {
    return this.metrics.fps;
  }

  /**
   * Check if FPS is low
   */
  public isLowFPS(): boolean {
    return this.metrics.fps < this.thresholds.lowFPSThreshold;
  }

  /**
   * Check if FPS is critical
   */
  public isCriticalFPS(): boolean {
    return this.metrics.fps < this.thresholds.criticalFPSThreshold;
  }

  /**
   * Detect if device is low-end
   */
  public isLowEndDevice(): boolean {
    return this.metrics.isLowEndDevice;
  }

  /**
   * Detect low-end device based on hardware capabilities
   */
  private detectLowEndDevice(): boolean {
    if (typeof window === 'undefined') return false;

    const cpuCores = this.getCPUCores();
    const deviceMemory = this.getDeviceMemory();

    // Consider low-end if:
    // - Less than 4 CPU cores
    // - Less than 4GB RAM
    // - Slow connection (2g, slow-2g)
    const isLowCPU = cpuCores < 4;
    const isLowMemory = deviceMemory < 4;
    const isSlowConnection = ['slow-2g', '2g'].includes(this.getConnectionType());

    return isLowCPU || isLowMemory || isSlowConnection;
  }

  /**
   * Get number of CPU cores
   */
  private getCPUCores(): number {
    if (typeof window === 'undefined' || !navigator.hardwareConcurrency) {
      return 4; // Default assumption
    }
    return navigator.hardwareConcurrency;
  }

  /**
   * Get device memory in GB
   */
  private getDeviceMemory(): number {
    if (typeof window === 'undefined') return 4; // Default assumption

    // @ts-ignore - deviceMemory is not in TypeScript types yet
    const memory = navigator.deviceMemory;
    return memory ?? 4; // Default to 4GB if not available
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string {
    if (typeof window === 'undefined' || !navigator.connection) {
      return 'unknown';
    }

    // @ts-ignore - connection is not fully typed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType ?? 'unknown';
  }

  /**
   * Reset metrics
   */
  public reset(): void {
    this.frameTimes = [];
    this.droppedFrames = 0;
    this.totalFrames = 0;
    this.metrics.droppedFrames = 0;
    this.metrics.totalFrames = 0;
  }

  /**
   * Update thresholds
   */
  public updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Get performance report
   */
  public getReport(): string {
    const { fps, frameTime, droppedFrames, totalFrames, isLowEndDevice, cpuCores, deviceMemory, connectionType } =
      this.metrics;

    const dropRate = totalFrames > 0 ? ((droppedFrames / totalFrames) * 100).toFixed(2) : '0.00';

    return `
Performance Report:
- FPS: ${fps}
- Frame Time: ${frameTime}ms
- Dropped Frames: ${droppedFrames} (${dropRate}%)
- Total Frames: ${totalFrames}
- Low-End Device: ${isLowEndDevice ? 'Yes' : 'No'}
- CPU Cores: ${cpuCores}
- Device Memory: ${deviceMemory}GB
- Connection: ${connectionType}
    `.trim();
  }

  /**
   * Cleanup and destroy
   */
  public destroy(): void {
    this.stop();
    this.callbacks.clear();
    this.reset();
  }
}

// Singleton instance for global performance monitoring
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getGlobalPerformanceMonitor(thresholds?: PerformanceThresholds): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor(thresholds);
  } else if (thresholds) {
    globalPerformanceMonitor.updateThresholds(thresholds);
  }
  return globalPerformanceMonitor;
}

export function destroyGlobalPerformanceMonitor(): void {
  if (globalPerformanceMonitor) {
    globalPerformanceMonitor.destroy();
    globalPerformanceMonitor = null;
  }
}
