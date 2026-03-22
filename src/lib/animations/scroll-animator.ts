// Scroll-based animation utilities using Intersection Observer

export interface ScrollAnimatorConfig {
  threshold?: number | number[]; // Visibility threshold (0-1, default: 0.1)
  rootMargin?: string; // Root margin for early/late triggering (default: '0px')
  once?: boolean; // Animate only once (default: true)
  stagger?: number; // Stagger delay between elements in ms (default: 0)
  root?: Element | null; // Root element for intersection (default: viewport)
}

export interface ScrollAnimatorCallbacks {
  onEnter?: (element: Element, entry: IntersectionObserverEntry) => void;
  onExit?: (element: Element, entry: IntersectionObserverEntry) => void;
  onChange?: (element: Element, entry: IntersectionObserverEntry) => void;
}

interface ElementState {
  element: Element;
  hasAnimated: boolean;
  staggerDelay: number;
}

export class ScrollAnimator {
  private observer: IntersectionObserver | null = null;
  private elements: Map<Element, ElementState> = new Map();
  private config: Required<Omit<ScrollAnimatorConfig, 'root'>> & { root: Element | null };
  private callbacks: ScrollAnimatorCallbacks;
  private staggerIndex = 0;

  constructor(callbacks: ScrollAnimatorCallbacks, config: ScrollAnimatorConfig = {}) {
    this.callbacks = callbacks;
    this.config = {
      threshold: config.threshold ?? 0.1,
      rootMargin: config.rootMargin ?? '0px',
      once: config.once ?? true,
      stagger: config.stagger ?? 0,
      root: config.root ?? null,
    };

    this.initObserver();
  }

  private initObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.handleIntersection(entry);
        });
      },
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin,
        root: this.config.root,
      }
    );
  }

  private handleIntersection(entry: IntersectionObserverEntry): void {
    const elementState = this.elements.get(entry.target);
    if (!elementState) return;

    // Always trigger onChange callback
    this.callbacks.onChange?.(entry.target, entry);

    if (entry.isIntersecting) {
      // Element is entering viewport
      if (!elementState.hasAnimated || !this.config.once) {
        // Apply stagger delay if configured
        if (elementState.staggerDelay > 0) {
          setTimeout(() => {
            this.callbacks.onEnter?.(entry.target, entry);
          }, elementState.staggerDelay);
        } else {
          this.callbacks.onEnter?.(entry.target, entry);
        }

        elementState.hasAnimated = true;

        // Unobserve if once is true
        if (this.config.once) {
          this.observer?.unobserve(entry.target);
        }
      }
    } else {
      // Element is exiting viewport
      if (!this.config.once) {
        this.callbacks.onExit?.(entry.target, entry);
      }
    }
  }

  public observe(element: Element): void {
    if (!this.observer || this.elements.has(element)) return;

    const staggerDelay = this.config.stagger > 0 ? this.staggerIndex * this.config.stagger : 0;
    this.staggerIndex++;

    this.elements.set(element, {
      element,
      hasAnimated: false,
      staggerDelay,
    });

    this.observer.observe(element);
  }

  public unobserve(element: Element): void {
    if (!this.observer) return;

    this.observer.unobserve(element);
    this.elements.delete(element);
  }

  public observeMultiple(elements: Element[]): void {
    elements.forEach((element) => this.observe(element));
  }

  public unobserveAll(): void {
    if (!this.observer) return;

    this.elements.forEach((_, element) => {
      this.observer?.unobserve(element);
    });
    this.elements.clear();
    this.staggerIndex = 0;
  }

  public reset(element?: Element): void {
    if (element) {
      const elementState = this.elements.get(element);
      if (elementState) {
        elementState.hasAnimated = false;
      }
    } else {
      // Reset all elements
      this.elements.forEach((state) => {
        state.hasAnimated = false;
      });
    }
  }

  public updateConfig(config: Partial<ScrollAnimatorConfig>): void {
    const needsRecreate =
      config.threshold !== undefined ||
      config.rootMargin !== undefined ||
      config.root !== undefined;

    this.config = { ...this.config, ...config };

    if (needsRecreate && this.observer) {
      // Store current elements
      const currentElements = Array.from(this.elements.keys());

      // Destroy and recreate observer
      this.destroy();
      this.initObserver();

      // Re-observe elements
      currentElements.forEach((element) => this.observe(element));
    }
  }

  public updateCallbacks(callbacks: Partial<ScrollAnimatorCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements.clear();
    this.staggerIndex = 0;
  }

  public isObserving(element: Element): boolean {
    return this.elements.has(element);
  }

  public hasAnimated(element: Element): boolean {
    return this.elements.get(element)?.hasAnimated ?? false;
  }

  public getObservedElements(): Element[] {
    return Array.from(this.elements.keys());
  }
}

// Singleton instance for global scroll animations
let globalScrollAnimator: ScrollAnimator | null = null;

export function getGlobalScrollAnimator(
  callbacks?: ScrollAnimatorCallbacks,
  config?: ScrollAnimatorConfig
): ScrollAnimator {
  if (!globalScrollAnimator) {
    globalScrollAnimator = new ScrollAnimator(callbacks ?? {}, config);
  } else if (callbacks) {
    globalScrollAnimator.updateCallbacks(callbacks);
  }
  if (config) {
    globalScrollAnimator.updateConfig(config);
  }
  return globalScrollAnimator;
}

export function destroyGlobalScrollAnimator(): void {
  if (globalScrollAnimator) {
    globalScrollAnimator.destroy();
    globalScrollAnimator = null;
  }
}
