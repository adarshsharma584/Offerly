// Viewport observer wrapper for lazy loading and proximity detection

export interface ViewportObserverConfig {
  threshold?: number | number[]; // Visibility threshold (default: 0)
  rootMargin?: string; // Root margin for proximity (default: '0px')
  root?: Element | null; // Root element (default: viewport)
  once?: boolean; // Observe only once (default: true)
}

export interface ViewportObserverCallbacks {
  onEnter?: (element: Element, entry: IntersectionObserverEntry) => void;
  onExit?: (element: Element, entry: IntersectionObserverEntry) => void;
  onChange?: (element: Element, entry: IntersectionObserverEntry) => void;
}

interface ObservedElement {
  element: Element;
  hasEntered: boolean;
}

export class ViewportObserver {
  private observer: IntersectionObserver | null = null;
  private elements: Map<Element, ObservedElement> = new Map();
  private config: Required<Omit<ViewportObserverConfig, 'root'>> & { root: Element | null };
  private callbacks: ViewportObserverCallbacks;

  constructor(callbacks: ViewportObserverCallbacks, config: ViewportObserverConfig = {}) {
    this.callbacks = callbacks;
    this.config = {
      threshold: config.threshold ?? 0,
      rootMargin: config.rootMargin ?? '0px',
      root: config.root ?? null,
      once: config.once ?? true,
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
    const observedElement = this.elements.get(entry.target);
    if (!observedElement) return;

    // Always trigger onChange
    this.callbacks.onChange?.(entry.target, entry);

    if (entry.isIntersecting) {
      // Element entered viewport
      if (!observedElement.hasEntered) {
        observedElement.hasEntered = true;
        this.callbacks.onEnter?.(entry.target, entry);

        // Unobserve if once is true
        if (this.config.once) {
          this.unobserve(entry.target);
        }
      }
    } else {
      // Element exited viewport
      if (!this.config.once) {
        this.callbacks.onExit?.(entry.target, entry);
      }
    }
  }

  public observe(element: Element): void {
    if (!this.observer || this.elements.has(element)) return;

    this.elements.set(element, {
      element,
      hasEntered: false,
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
  }

  public isObserving(element: Element): boolean {
    return this.elements.has(element);
  }

  public hasEntered(element: Element): boolean {
    return this.elements.get(element)?.hasEntered ?? false;
  }

  public getObservedElements(): Element[] {
    return Array.from(this.elements.keys());
  }

  public updateConfig(config: Partial<ViewportObserverConfig>): void {
    const needsRecreate =
      config.threshold !== undefined ||
      config.rootMargin !== undefined ||
      config.root !== undefined;

    this.config = { ...this.config, ...config };

    if (needsRecreate && this.observer) {
      const currentElements = Array.from(this.elements.keys());
      this.destroy();
      this.initObserver();
      currentElements.forEach((element) => this.observe(element));
    }
  }

  public updateCallbacks(callbacks: Partial<ViewportObserverCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements.clear();
  }
}

/**
 * Create a viewport observer for lazy loading
 * Uses proximity margin to load content before it enters viewport
 */
export function createLazyLoadObserver(
  onLoad: (element: Element) => void,
  proximityMargin: string = '200px'
): ViewportObserver {
  return new ViewportObserver(
    {
      onEnter: onLoad,
    },
    {
      rootMargin: proximityMargin,
      once: true,
    }
  );
}

/**
 * Create a viewport observer for proximity detection
 */
export function createProximityObserver(
  onNear: (element: Element) => void,
  onFar: (element: Element) => void,
  proximityMargin: string = '100px'
): ViewportObserver {
  return new ViewportObserver(
    {
      onEnter: onNear,
      onExit: onFar,
    },
    {
      rootMargin: proximityMargin,
      once: false,
    }
  );
}

/**
 * Create a viewport observer for infinite scroll
 */
export function createInfiniteScrollObserver(
  onLoadMore: () => void,
  triggerDistance: string = '400px'
): ViewportObserver {
  return new ViewportObserver(
    {
      onEnter: onLoadMore,
    },
    {
      rootMargin: `0px 0px ${triggerDistance} 0px`,
      once: false,
    }
  );
}

/**
 * Utility to observe image lazy loading
 */
export function observeImageLazyLoad(
  img: HTMLImageElement,
  src: string,
  proximityMargin: string = '200px'
): ViewportObserver {
  const observer = createLazyLoadObserver((element) => {
    const image = element as HTMLImageElement;
    image.src = src;
    image.classList.add('loaded');
  }, proximityMargin);

  observer.observe(img);
  return observer;
}

/**
 * Utility to observe multiple images for lazy loading
 */
export function observeImagesLazyLoad(
  images: HTMLImageElement[],
  proximityMargin: string = '200px'
): ViewportObserver {
  const observer = createLazyLoadObserver((element) => {
    const image = element as HTMLImageElement;
    const src = image.dataset.src;
    if (src) {
      image.src = src;
      image.removeAttribute('data-src');
      image.classList.add('loaded');
    }
  }, proximityMargin);

  observer.observeMultiple(images);
  return observer;
}
