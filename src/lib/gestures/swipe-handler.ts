// Swipe gesture detection utilities

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export type SwipeAxis = 'horizontal' | 'vertical' | 'both';

export interface SwipeConfig {
  threshold?: number; // Minimum distance in pixels to trigger swipe (default: 50)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (default: 0.3)
  axis?: SwipeAxis; // Which directions to detect (default: 'both')
  preventScroll?: boolean; // Prevent default scroll behavior (default: false)
}

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeMove?: (distance: number, direction: SwipeDirection) => void;
  onSwipeEnd?: (direction: SwipeDirection | null) => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export class SwipeHandler {
  private startPoint: TouchPoint | null = null;
  private currentPoint: TouchPoint | null = null;
  private config: Required<SwipeConfig>;
  private callbacks: SwipeCallbacks;
  private element: HTMLElement;
  private isSwiping = false;

  constructor(element: HTMLElement, callbacks: SwipeCallbacks, config: SwipeConfig = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      threshold: config.threshold ?? 50,
      velocityThreshold: config.velocityThreshold ?? 0.3,
      axis: config.axis ?? 'both',
      preventScroll: config.preventScroll ?? false,
    };

    this.attachListeners();
  }

  private attachListeners(): void {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: !this.config.preventScroll });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: !this.config.preventScroll });
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchCancel);

    // Mouse events for desktop testing
    this.element.addEventListener('mousedown', this.handleMouseDown);
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (this.config.preventScroll) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    this.currentPoint = { ...this.startPoint };
    this.isSwiping = false;
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.startPoint) return;

    if (this.config.preventScroll) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    this.currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const distance = this.getDistance();
    const direction = this.getDirection();

    if (!this.isSwiping && distance > 10) {
      this.isSwiping = true;
      if (direction && this.callbacks.onSwipeStart) {
        this.callbacks.onSwipeStart(direction);
      }
    }

    if (this.isSwiping && direction && this.callbacks.onSwipeMove) {
      this.callbacks.onSwipeMove(distance, direction);
    }
  };

  private handleTouchEnd = (): void => {
    if (!this.startPoint || !this.currentPoint) return;

    const direction = this.detectSwipe();
    
    if (this.callbacks.onSwipeEnd) {
      this.callbacks.onSwipeEnd(direction);
    }

    if (direction) {
      this.triggerSwipeCallback(direction);
    }

    this.reset();
  };

  private handleTouchCancel = (): void => {
    if (this.callbacks.onSwipeEnd) {
      this.callbacks.onSwipeEnd(null);
    }
    this.reset();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    this.startPoint = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    this.currentPoint = { ...this.startPoint };
    this.isSwiping = false;

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      if (!this.startPoint) return;

      this.currentPoint = {
        x: moveEvent.clientX,
        y: moveEvent.clientY,
        time: Date.now(),
      };

      const distance = this.getDistance();
      const direction = this.getDirection();

      if (!this.isSwiping && distance > 10) {
        this.isSwiping = true;
        if (direction && this.callbacks.onSwipeStart) {
          this.callbacks.onSwipeStart(direction);
        }
      }

      if (this.isSwiping && direction && this.callbacks.onSwipeMove) {
        this.callbacks.onSwipeMove(distance, direction);
      }
    };

    const handleMouseUp = (): void => {
      if (!this.startPoint || !this.currentPoint) return;

      const direction = this.detectSwipe();
      
      if (this.callbacks.onSwipeEnd) {
        this.callbacks.onSwipeEnd(direction);
      }

      if (direction) {
        this.triggerSwipeCallback(direction);
      }

      this.reset();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  private getDistance(): number {
    if (!this.startPoint || !this.currentPoint) return 0;

    const dx = this.currentPoint.x - this.startPoint.x;
    const dy = this.currentPoint.y - this.startPoint.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private getDirection(): SwipeDirection | null {
    if (!this.startPoint || !this.currentPoint) return null;

    const dx = this.currentPoint.x - this.startPoint.x;
    const dy = this.currentPoint.y - this.startPoint.y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Determine primary direction
    if (absDx > absDy) {
      // Horizontal swipe
      if (this.config.axis === 'vertical') return null;
      return dx > 0 ? 'right' : 'left';
    } else {
      // Vertical swipe
      if (this.config.axis === 'horizontal') return null;
      return dy > 0 ? 'down' : 'up';
    }
  }

  private getVelocity(): number {
    if (!this.startPoint || !this.currentPoint) return 0;

    const distance = this.getDistance();
    const time = this.currentPoint.time - this.startPoint.time;

    return time > 0 ? distance / time : 0;
  }

  private detectSwipe(): SwipeDirection | null {
    if (!this.startPoint || !this.currentPoint) return null;

    const distance = this.getDistance();
    const velocity = this.getVelocity();
    const direction = this.getDirection();

    // Check if swipe meets threshold requirements
    if (distance >= this.config.threshold || velocity >= this.config.velocityThreshold) {
      return direction;
    }

    return null;
  }

  private triggerSwipeCallback(direction: SwipeDirection): void {
    switch (direction) {
      case 'left':
        this.callbacks.onSwipeLeft?.();
        break;
      case 'right':
        this.callbacks.onSwipeRight?.();
        break;
      case 'up':
        this.callbacks.onSwipeUp?.();
        break;
      case 'down':
        this.callbacks.onSwipeDown?.();
        break;
    }
  }

  private reset(): void {
    this.startPoint = null;
    this.currentPoint = null;
    this.isSwiping = false;
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.reset();
  }

  public updateConfig(config: Partial<SwipeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public updateCallbacks(callbacks: Partial<SwipeCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}
