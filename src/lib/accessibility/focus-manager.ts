// Focus management utilities for keyboard navigation and accessibility

/**
 * Creates a focus trap within a container element
 * Useful for modals and dialogs to keep focus within the component
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstElement.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => {
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        !element.hasAttribute('hidden')
      );
    }
  );
}

/**
 * Restores focus to a previously focused element
 */
export function restoreFocus(element: HTMLElement | null): void {
  if (element && typeof element.focus === 'function') {
    // Use setTimeout to ensure the element is ready to receive focus
    setTimeout(() => {
      element.focus();
    }, 0);
  }
}

/**
 * Saves the currently focused element
 */
export function saveFocus(): HTMLElement | null {
  return document.activeElement as HTMLElement;
}

/**
 * Creates a skip-to-content link for keyboard navigation
 */
export function createSkipLink(targetId: string, text: string = 'Skip to content'): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded-lg';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return skipLink;
}

/**
 * Manages tab order for custom components
 */
export function setTabIndex(element: HTMLElement, index: number): void {
  element.setAttribute('tabindex', String(index));
}

/**
 * Removes an element from tab order
 */
export function removeFromTabOrder(element: HTMLElement): void {
  element.setAttribute('tabindex', '-1');
}

/**
 * Adds an element to tab order
 */
export function addToTabOrder(element: HTMLElement): void {
  element.setAttribute('tabindex', '0');
}
