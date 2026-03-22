// Lazy loading utilities for images and components

import { ViewportObserver, createLazyLoadObserver } from './viewport-observer';

export interface LazyImageConfig {
  src: string;
  placeholder?: string; // Placeholder image URL
  blurHash?: string; // BlurHash string for blur-up effect
  proximityMargin?: string; // Distance from viewport to start loading (default: '200px')
  fadeInDuration?: number; // Fade-in duration in ms (default: 300)
  onLoad?: (img: HTMLImageElement) => void;
  onError?: (img: HTMLImageElement, error: Event) => void;
}

export interface LazyComponentConfig {
  proximityMargin?: string; // Distance from viewport to start loading (default: '100px')
  onLoad?: (element: Element) => void;
}

/**
 * Lazy load an image with blur-up placeholder
 */
export function lazyLoadImage(img: HTMLImageElement, config: LazyImageConfig): ViewportObserver {
  const {
    src,
    placeholder,
    blurHash,
    proximityMargin = '200px',
    fadeInDuration = 300,
    onLoad,
    onError,
  } = config;

  // Set placeholder if provided
  if (placeholder) {
    img.src = placeholder;
    img.style.filter = 'blur(10px)';
    img.style.transition = `filter ${fadeInDuration}ms ease-out`;
  } else if (blurHash) {
    // TODO: Implement BlurHash decoding
    // For now, use a simple gray placeholder
    img.style.backgroundColor = '#e0e0e0';
  }

  // Store original src in data attribute
  img.dataset.src = src;

  // Create observer
  const observer = createLazyLoadObserver((element) => {
    const image = element as HTMLImageElement;
    const imageSrc = image.dataset.src;

    if (!imageSrc) return;

    // Create a new image to preload
    const tempImage = new Image();

    tempImage.onload = () => {
      // Set the actual image
      image.src = imageSrc;
      image.removeAttribute('data-src');

      // Remove blur effect
      if (placeholder) {
        image.style.filter = 'blur(0)';
      }

      // Add loaded class
      image.classList.add('lazy-loaded');

      // Trigger callback
      onLoad?.(image);
    };

    tempImage.onerror = (error) => {
      image.classList.add('lazy-error');
      onError?.(image, error);
    };

    // Start loading
    tempImage.src = imageSrc;
  }, proximityMargin);

  observer.observe(img);
  return observer;
}

/**
 * Lazy load multiple images
 */
export function lazyLoadImages(
  images: HTMLImageElement[],
  getConfig: (img: HTMLImageElement, index: number) => LazyImageConfig
): ViewportObserver[] {
  return images.map((img, index) => lazyLoadImage(img, getConfig(img, index)));
}

/**
 * Lazy load images by selector
 */
export function lazyLoadImagesBySelector(
  selector: string = '[data-lazy-src]',
  config: Omit<LazyImageConfig, 'src'> = {}
): ViewportObserver[] {
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  return Array.from(images).map((img) => {
    const src = img.dataset.lazySrc || img.dataset.src || '';
    return lazyLoadImage(img, { ...config, src });
  });
}

/**
 * Create a blur-up placeholder from a data URL
 */
export function createBlurUpPlaceholder(
  width: number,
  height: number,
  color: string = '#e0e0e0'
): string {
  // Create a tiny canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fill with color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Return data URL
  return canvas.toDataURL('image/png');
}

/**
 * Lazy load a background image
 */
export function lazyLoadBackgroundImage(
  element: HTMLElement,
  config: LazyImageConfig
): ViewportObserver {
  const { src, placeholder, proximityMargin = '200px', fadeInDuration = 300, onLoad, onError } = config;

  // Set placeholder if provided
  if (placeholder) {
    element.style.backgroundImage = `url(${placeholder})`;
    element.style.filter = 'blur(10px)';
    element.style.transition = `filter ${fadeInDuration}ms ease-out`;
  }

  // Store original src in data attribute
  element.dataset.bgSrc = src;

  // Create observer
  const observer = createLazyLoadObserver((el) => {
    const bgSrc = (el as HTMLElement).dataset.bgSrc;
    if (!bgSrc) return;

    // Preload image
    const tempImage = new Image();

    tempImage.onload = () => {
      (el as HTMLElement).style.backgroundImage = `url(${bgSrc})`;
      el.removeAttribute('data-bg-src');

      // Remove blur effect
      if (placeholder) {
        (el as HTMLElement).style.filter = 'blur(0)';
      }

      el.classList.add('lazy-loaded');
      onLoad?.(el as HTMLElement);
    };

    tempImage.onerror = (error) => {
      el.classList.add('lazy-error');
      onError?.(el as HTMLElement, error);
    };

    tempImage.src = bgSrc;
  }, proximityMargin);

  observer.observe(element);
  return observer;
}

/**
 * Lazy load component (trigger loading when near viewport)
 */
export function lazyLoadComponent(element: Element, config: LazyComponentConfig = {}): ViewportObserver {
  const { proximityMargin = '100px', onLoad } = config;

  const observer = createLazyLoadObserver((el) => {
    el.classList.add('lazy-loaded');
    onLoad?.(el);
  }, proximityMargin);

  observer.observe(element);
  return observer;
}

/**
 * Preload images for better performance
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * Preload image with priority
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Set fetchpriority if supported
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = priority;
    }

    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpeg';
  }

  return 'jpeg';
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(baseUrl: string, widths: number[], format?: string): string {
  const imageFormat = format || getOptimalImageFormat();
  return widths
    .map((width) => {
      const url = baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `-${width}w.${imageFormat}`);
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { maxWidth: string; size: string }[]): string {
  return breakpoints
    .map((bp, index) => {
      if (index === breakpoints.length - 1) {
        return bp.size; // Last one is the default
      }
      return `(max-width: ${bp.maxWidth}) ${bp.size}`;
    })
    .join(', ');
}

/**
 * Utility to create responsive image attributes
 */
export function createResponsiveImageAttrs(
  baseUrl: string,
  options: {
    widths?: number[];
    breakpoints?: { maxWidth: string; size: string }[];
    format?: string;
  } = {}
): {
  srcSet: string;
  sizes: string;
} {
  const widths = options.widths || [320, 640, 1024, 1920];
  const breakpoints = options.breakpoints || [
    { maxWidth: '640px', size: '100vw' },
    { maxWidth: '1024px', size: '50vw' },
    { maxWidth: '1920px', size: '33vw' },
    { maxWidth: '9999px', size: '25vw' },
  ];

  return {
    srcSet: generateSrcSet(baseUrl, widths, options.format),
    sizes: generateSizes(breakpoints),
  };
}
