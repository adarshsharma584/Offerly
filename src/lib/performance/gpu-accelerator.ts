// GPU acceleration utilities for optimizing animations

export interface GPUAcceleratorConfig {
  useWillChange?: boolean; // Use will-change CSS property (default: true)
  useTransform3d?: boolean; // Use transform3d for GPU layer (default: true)
  autoCleanup?: boolean; // Auto cleanup after animation (default: true)
  cleanupDelay?: number; // Delay before cleanup in ms (default: 1000)
}

interface AcceleratedElement {
  element: HTMLElement;
  config: Required<GPUAcceleratorConfig>;
  cleanupTimer: number | null;
  properties: Set<string>;
}

export class GPUAccelerator {
  private elements: Map<HTMLElement, AcceleratedElement> = new Map();

  /**
   * Accelerate an element for GPU rendering
   */
  public accelerate(
    element: HTMLElement,
    properties: string[] = ['transform', 'opacity'],
    config: GPUAcceleratorConfig = {}
  ): void {
    if (typeof window === 'undefined') return;

    const fullConfig: Required<GPUAcceleratorConfig> = {
      useWillChange: config.useWillChange ?? true,
      useTransform3d: config.useTransform3d ?? true,
      autoCleanup: config.autoCleanup ?? true,
      cleanupDelay: config.cleanupDelay ?? 1000,
    };

    // Cancel existing cleanup timer if element is already accelerated
    const existing = this.elements.get(element);
    if (existing?.cleanupTimer) {
      clearTimeout(existing.cleanupTimer);
    }

    // Apply will-change
    if (fullConfig.useWillChange) {
      element.style.willChange = properties.join(', ');
    }

    // Apply transform3d to create GPU layer
    if (fullConfig.useTransform3d && !element.style.transform) {
      element.style.transform = 'translate3d(0, 0, 0)';
    }

    // Store element state
    this.elements.set(element, {
      element,
      config: fullConfig,
      cleanupTimer: null,
      properties: new Set(properties),
    });

    // Schedule auto cleanup if enabled
    if (fullConfig.autoCleanup) {
      this.scheduleCleanup(element, fullConfig.cleanupDelay);
    }
  }

  /**
   * Decelerate an element (remove GPU acceleration)
   */
  public decelerate(element: HTMLElement): void {
    const accelerated = this.elements.get(element);
    if (!accelerated) return;

    // Cancel cleanup timer
    if (accelerated.cleanupTimer) {
      clearTimeout(accelerated.cleanupTimer);
    }

    // Remove will-change
    element.style.willChange = '';

    // Remove transform3d if it was only for GPU acceleration
    if (element.style.transform === 'translate3d(0, 0, 0)') {
      element.style.transform = '';
    }

    this.elements.delete(element);
  }

  /**
   * Schedule cleanup for an element
   */
  private scheduleCleanup(element: HTMLElement, delay: number): void {
    const accelerated = this.elements.get(element);
    if (!accelerated) return;

    accelerated.cleanupTimer = window.setTimeout(() => {
      this.decelerate(element);
    }, delay);
  }

  /**
   * Cancel scheduled cleanup for an element
   */
  public cancelCleanup(element: HTMLElement): void {
    const accelerated = this.elements.get(element);
    if (accelerated?.cleanupTimer) {
      clearTimeout(accelerated.cleanupTimer);
      accelerated.cleanupTimer = null;
    }
  }

  /**
   * Extend cleanup delay for an element
   */
  public extendCleanup(element: HTMLElement, additionalDelay: number = 1000): void {
    const accelerated = this.elements.get(element);
    if (!accelerated) return;

    if (accelerated.cleanupTimer) {
      clearTimeout(accelerated.cleanupTimer);
    }

    this.scheduleCleanup(element, additionalDelay);
  }

  /**
   * Update properties for an accelerated element
   */
  public updateProperties(element: HTMLElement, properties: string[]): void {
    const accelerated = this.elements.get(element);
    if (!accelerated) return;

    accelerated.properties = new Set(properties);

    if (accelerated.config.useWillChange) {
      element.style.willChange = properties.join(', ');
    }
  }

  /**
   * Check if an element is accelerated
   */
  public isAccelerated(element: HTMLElement): boolean {
    return this.elements.has(element);
  }

  /**
   * Get all accelerated elements
   */
  public getAcceleratedElements(): HTMLElement[] {
    return Array.from(this.elements.keys());
  }

  /**
   * Decelerate all elements
   */
  public decelerateAll(): void {
    this.elements.forEach((_, element) => {
      this.decelerate(element);
    });
  }

  /**
   * Cleanup and destroy
   */
  public destroy(): void {
    this.decelerateAll();
  }
}

// Singleton instance for global GPU acceleration
let globalGPUAccelerator: GPUAccelerator | null = null;

export function getGlobalGPUAccelerator(): GPUAccelerator {
  if (!globalGPUAccelerator) {
    globalGPUAccelerator = new GPUAccelerator();
  }
  return globalGPUAccelerator;
}

export function destroyGlobalGPUAccelerator(): void {
  if (globalGPUAccelerator) {
    globalGPUAccelerator.destroy();
    globalGPUAccelerator = null;
  }
}

/**
 * Utility function to accelerate an element
 */
export function accelerateElement(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity'],
  config?: GPUAcceleratorConfig
): void {
  const accelerator = getGlobalGPUAccelerator();
  accelerator.accelerate(element, properties, config);
}

/**
 * Utility function to decelerate an element
 */
export function decelerateElement(element: HTMLElement): void {
  const accelerator = getGlobalGPUAccelerator();
  accelerator.decelerate(element);
}
