// Long press gesture detection utilities

export interface LongPressConfig {
  duration?: number; // Duration in ms to trigger long press (default: 500)
  threshold?: number; // Maximum movement in pixels before canceling (default: 10)
  preventDefault?: boolean; // Prevent default context menu (default: true)
}

export interface LongPressCallbacks {
  onLongPress?: (x: number, y: number) => void;
  onLongPressStart?: (x: number, y: number) => void;
  onLongPressCancel?: () => void;
}

interface LongPressState {
  isPressed: boolean;
  startX: number;
  startY: number;
  timer: number | null;
}

export class LongPressHandler {
  private element: HTMLElement;
  private config: Required<LongPressConfig>;
  private callbacks: LongPressCallbacks;
  private state: LongPressState;

  constructor(element: HTMLElement, callbacks: LongPressCallbacks, config: LongPressConfig = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      duration: config.duration ?? 500,
      threshold: config.threshold ?? 10,
      preventDefault: config.preventDefault ?? true,
    };

    this.state = {
      isPressed: false,
      startX: 0,
      startY: 0,
      timer: null,
    };

    this.attachListeners();
  }

  private attachListeners(): void {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchCancel);

    // Mouse events
    this.element.addEventListener('mousedown', this.handleMouseDown);

    // Prevent context menu if configured
    if (this.config.preventDefault) {
      this.element.addEventListener('contextmenu', this.handleContextMenu);
    }
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (this.config.preventDefault) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    this.startPress(touch.clientX, touch.clientY);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.state.isPressed) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.state.startX);
    const deltaY = Math.abs(touch.clientY - this.state.startY);

    // Cancel if moved beyond threshold
    if (deltaX > this.config.threshold || deltaY > this.config.threshold) {
      this.cancelPress();
    }
  };

  private handleTouchEnd = (): void => {
    this.cancelPress();
  };

  private handleTouchCancel = (): void => {
    this.cancelPress();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (this.config.preventDefault) {
      e.preventDefault();
    }

    this.startPress(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      if (!this.state.isPressed) return;

      const deltaX = Math.abs(moveEvent.clientX - this.state.startX);
      const deltaY = Math.abs(moveEvent.clientY - this.state.startY);

      // Cancel if moved beyond threshold
      if (deltaX > this.config.threshold || deltaY > this.config.threshold) {
        this.cancelPress();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (): void => {
      this.cancelPress();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  private handleContextMenu = (e: Event): void => {
    if (this.config.preventDefault) {
      e.preventDefault();
    }
  };

  private startPress(x: number, y: number): void {
    this.state.isPressed = true;
    this.state.startX = x;
    this.state.startY = y;

    this.callbacks.onLongPressStart?.(x, y);

    // Set timer for long press
    this.state.timer = window.setTimeout(() => {
      if (this.state.isPressed) {
        this.triggerLongPress();
      }
    }, this.config.duration);
  }

  private triggerLongPress(): void {
    this.callbacks.onLongPress?.(this.state.startX, this.state.startY);
    this.reset();
  }

  private cancelPress(): void {
    if (this.state.isPressed) {
      this.callbacks.onLongPressCancel?.();
    }
    this.reset();
  }

  private reset(): void {
    if (this.state.timer !== null) {
      clearTimeout(this.state.timer);
      this.state.timer = null;
    }
    this.state.isPressed = false;
    this.state.startX = 0;
    this.state.startY = 0;
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('contextmenu', this.handleContextMenu);
    this.reset();
  }

  public updateConfig(config: Partial<LongPressConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public updateCallbacks(callbacks: Partial<LongPressCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}
