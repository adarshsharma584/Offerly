// Parallax scroll effect controller

import { motionPreference } from '@/lib/accessibility/motion-preference';

export type ParallaxDirection = 'up' | 'down' | 'left' | 'right';

export interface ParallaxConfig {
  speed?: number; // Speed multiplier (default: 0.5, range: -1 to 1)
  direction?: ParallaxDirection; // Direction of parallax (default: 'up')
  maxOffset?: number; // Maximum offset in pixels (default: 200)
  proximity?: number; // Distance from viewport to start effect in px (default: 0)
  smooth?: boolean; // Use smooth interpolation (default: true)
  smoothFactor?: number; // Smoothing factor (default: 0.1, range: 0-1)
}

interface ParallaxElement {
  element: HTMLElement;
  config: Required<ParallaxConfig>;
  currentOffset: number;
  targetOffset: number;
  initialPosition: { x: number; y: number };
}

export class ParallaxController {
  private elements: Map<HTMLElement, ParallaxElement> = new Map();
  private rafId: number | null = null;
  private isRunning = false;
  private lastScrollY = 0;
  private lastScrollX = 0;

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    this.update = this.update.bind(this);
  }

  public register(element: HTMLElement, config: ParallaxConfig = {}): void {
    // Don't register if reduced motion is preferred
    if (motionPreference.isReducedMotion()) {
      return;
    }

    const fullConfig: Required<ParallaxConfig> = {
      speed: config.speed ?? 0.5,
      direction: config.direction ?? 'up',
      maxOffset: config.maxOffset ?? 200,
      proximity: config.proximity ?? 0,
      smooth: config.smooth ?? true,
      smoothFactor: config.smoothFactor ?? 0.1,
    };

    // Get initial position
    const rect = element.getBoundingClientRect();
    const initialPosition = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };

    this.elements.set(element, {
      element,
      config: fullConfig,
      currentOffset: 0,
      targetOffset: 0,
      initialPosition,
    });

    // Start animation loop if not running
    if (!this.isRunning) {
      this.start();
    }
  }

  public unregister(element: HTMLElement): void {
    this.elements.delete(element);

    // Stop animation loop if no elements
    if (this.elements.size === 0) {
      this.stop();
    }
  }

  public unregisterAll(): void {
    this.elements.clear();
    this.stop();
  }

  public updateConfig(element: HTMLElement, config: Partial<ParallaxConfig>): void {
    const parallaxElement = this.elements.get(element);
    if (parallaxElement) {
      parallaxElement.config = { ...parallaxElement.config, ...config };
    }
  }

  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastScrollY = window.scrollY;
    this.lastScrollX = window.scrollX;

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.rafId = requestAnimationFrame(this.update);
  }

  private stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    window.removeEventListener('scroll', this.handleScroll);

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleScroll(): void {
    this.lastScrollY = window.scrollY;
    this.lastScrollX = window.scrollX;
  }

  private update(): void {
    if (!this.isRunning) return;

    // Check if reduced motion is enabled
    if (motionPreference.isReducedMotion()) {
      this.stop();
      return;
    }

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    this.elements.forEach((parallaxElement) => {
      const { element, config, initialPosition } = parallaxElement;

      // Get element position
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementLeft = rect.left;
      const elementRight = rect.right;

      // Check if element is in proximity of viewport
      const isInProximity =
        elementBottom >= -config.proximity &&
        elementTop <= viewportHeight + config.proximity &&
        elementRight >= -config.proximity &&
        elementLeft <= viewportWidth + config.proximity;

      if (!isInProximity) {
        return;
      }

      // Calculate scroll progress relative to element
      const elementCenter = elementTop + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;

      // Calculate target offset based on direction
      let targetOffset = 0;

      switch (config.direction) {
        case 'up':
          targetOffset = distanceFromCenter * config.speed;
          break;
        case 'down':
          targetOffset = -distanceFromCenter * config.speed;
          break;
        case 'left':
          targetOffset = distanceFromCenter * config.speed;
          break;
        case 'right':
          targetOffset = -distanceFromCenter * config.speed;
          break;
      }

      // Clamp to maxOffset
      targetOffset = Math.max(-config.maxOffset, Math.min(config.maxOffset, targetOffset));

      parallaxElement.targetOffset = targetOffset;

      // Apply smooth interpolation if enabled
      if (config.smooth) {
        parallaxElement.currentOffset +=
          (targetOffset - parallaxElement.currentOffset) * config.smoothFactor;
      } else {
        parallaxElement.currentOffset = targetOffset;
      }

      // Apply transform
      this.applyTransform(parallaxElement);
    });

    this.rafId = requestAnimationFrame(this.update);
  }

  private applyTransform(parallaxElement: ParallaxElement): void {
    const { element, config, currentOffset } = parallaxElement;

    let transform = '';

    switch (config.direction) {
      case 'up':
      case 'down':
        transform = `translate3d(0, ${currentOffset}px, 0)`;
        break;
      case 'left':
      case 'right':
        transform = `translate3d(${currentOffset}px, 0, 0)`;
        break;
    }

    element.style.transform = transform;
    element.style.willChange = 'transform';
  }

  public reset(element?: HTMLElement): void {
    if (element) {
      const parallaxElement = this.elements.get(element);
      if (parallaxElement) {
        parallaxElement.currentOffset = 0;
        parallaxElement.targetOffset = 0;
        element.style.transform = '';
        element.style.willChange = '';
      }
    } else {
      // Reset all elements
      this.elements.forEach((parallaxElement) => {
        parallaxElement.currentOffset = 0;
        parallaxElement.targetOffset = 0;
        parallaxElement.element.style.transform = '';
        parallaxElement.element.style.willChange = '';
      });
    }
  }

  public destroy(): void {
    this.reset();
    this.unregisterAll();
  }

  public isRegistered(element: HTMLElement): boolean {
    return this.elements.has(element);
  }

  public getRegisteredElements(): HTMLElement[] {
    return Array.from(this.elements.keys());
  }
}

// Singleton instance for global parallax effects
let globalParallaxController: ParallaxController | null = null;

export function getGlobalParallaxController(): ParallaxController {
  if (!globalParallaxController) {
    globalParallaxController = new ParallaxController();
  }
  return globalParallaxController;
}

export function destroyGlobalParallaxController(): void {
  if (globalParallaxController) {
    globalParallaxController.destroy();
    globalParallaxController = null;
  }
}
