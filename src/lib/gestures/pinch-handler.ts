// Pinch-to-zoom gesture detection utilities

export interface PinchConfig {
  minScale?: number; // Minimum scale factor (default: 0.5)
  maxScale?: number; // Maximum scale factor (default: 3)
  threshold?: number; // Minimum distance change to trigger pinch (default: 10)
}

export interface PinchCallbacks {
  onPinchStart?: (scale: number, centerX: number, centerY: number) => void;
  onPinch?: (scale: number, centerX: number, centerY: number) => void;
  onPinchEnd?: (scale: number, centerX: number, centerY: number) => void;
}

interface PinchState {
  isPinching: boolean;
  initialDistance: number;
  currentDistance: number;
  initialScale: number;
  currentScale: number;
  centerX: number;
  centerY: number;
}

export class PinchHandler {
  private element: HTMLElement;
  private config: Required<PinchConfig>;
  private callbacks: PinchCallbacks;
  private state: PinchState;

  constructor(element: HTMLElement, callbacks: PinchCallbacks, config: PinchConfig = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      minScale: config.minScale ?? 0.5,
      maxScale: config.maxScale ?? 3,
      threshold: config.threshold ?? 10,
    };

    this.state = {
      isPinching: false,
      initialDistance: 0,
      currentDistance: 0,
      initialScale: 1,
      currentScale: 1,
      centerX: 0,
      centerY: 0,
    };

    this.attachListeners();
  }

  private attachListeners(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchCancel);
  }

  private handleTouchStart = (e: TouchEvent): void => {
    // Only handle two-finger touches
    if (e.touches.length !== 2) {
      if (this.state.isPinching) {
        this.endPinch();
      }
      return;
    }

    e.preventDefault();

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const distance = this.calculateDistance(
      touch1.clientX,
      touch1.clientY,
      touch2.clientX,
      touch2.clientY
    );

    const center = this.calculateCenter(
      touch1.clientX,
      touch1.clientY,
      touch2.clientX,
      touch2.clientY
    );

    this.state.isPinching = true;
    this.state.initialDistance = distance;
    this.state.currentDistance = distance;
    this.state.initialScale = this.state.currentScale;
    this.state.centerX = center.x;
    this.state.centerY = center.y;

    this.callbacks.onPinchStart?.(this.state.currentScale, center.x, center.y);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.state.isPinching || e.touches.length !== 2) return;

    e.preventDefault();

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const distance = this.calculateDistance(
      touch1.clientX,
      touch1.clientY,
      touch2.clientX,
      touch2.clientY
    );

    const center = this.calculateCenter(
      touch1.clientX,
      touch1.clientY,
      touch2.clientX,
      touch2.clientY
    );

    // Check if distance change exceeds threshold
    const distanceChange = Math.abs(distance - this.state.initialDistance);
    if (distanceChange < this.config.threshold) return;

    this.state.currentDistance = distance;
    this.state.centerX = center.x;
    this.state.centerY = center.y;

    // Calculate scale based on distance ratio
    const scaleRatio = distance / this.state.initialDistance;
    let newScale = this.state.initialScale * scaleRatio;

    // Apply scale constraints
    newScale = Math.max(this.config.minScale, Math.min(this.config.maxScale, newScale));

    this.state.currentScale = newScale;

    this.callbacks.onPinch?.(newScale, center.x, center.y);
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    // End pinch if less than 2 touches remain
    if (e.touches.length < 2 && this.state.isPinching) {
      this.endPinch();
    }
  };

  private handleTouchCancel = (): void => {
    if (this.state.isPinching) {
      this.endPinch();
    }
  };

  private endPinch(): void {
    if (!this.state.isPinching) return;

    this.callbacks.onPinchEnd?.(
      this.state.currentScale,
      this.state.centerX,
      this.state.centerY
    );

    this.state.isPinching = false;
    this.state.initialDistance = 0;
    this.state.currentDistance = 0;
    this.state.initialScale = this.state.currentScale;
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateCenter(x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.state.isPinching = false;
  }

  public updateConfig(config: Partial<PinchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public updateCallbacks(callbacks: Partial<PinchCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public getCurrentScale(): number {
    return this.state.currentScale;
  }

  public setScale(scale: number): void {
    this.state.currentScale = Math.max(
      this.config.minScale,
      Math.min(this.config.maxScale, scale)
    );
    this.state.initialScale = this.state.currentScale;
  }

  public reset(): void {
    this.state.currentScale = 1;
    this.state.initialScale = 1;
    this.state.isPinching = false;
  }
}
