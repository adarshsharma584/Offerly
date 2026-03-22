// Drag gesture utilities with spring physics

export interface DragConfig {
  axis?: 'x' | 'y' | 'both'; // Constrain drag to axis (default: 'both')
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  elasticity?: number; // Resistance when dragging beyond bounds (0-1, default: 0.5)
  momentum?: boolean; // Enable momentum-based release (default: true)
  momentumVelocityThreshold?: number; // Minimum velocity for momentum (default: 0.5)
  momentumFriction?: number; // Friction coefficient for momentum (default: 0.95)
}

export interface DragCallbacks {
  onDragStart?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number, deltaX: number, deltaY: number) => void;
  onDragEnd?: (x: number, y: number, velocityX: number, velocityY: number) => void;
  onMomentumEnd?: (x: number, y: number) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  lastX: number;
  lastY: number;
  velocityX: number;
  velocityY: number;
  lastTime: number;
}

export class DragHandler {
  private element: HTMLElement;
  private config: Required<DragConfig>;
  private callbacks: DragCallbacks;
  private state: DragState;
  private momentumRAF: number | null = null;

  constructor(element: HTMLElement, callbacks: DragCallbacks, config: DragConfig = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      axis: config.axis ?? 'both',
      bounds: config.bounds ?? {},
      elasticity: config.elasticity ?? 0.5,
      momentum: config.momentum ?? true,
      momentumVelocityThreshold: config.momentumVelocityThreshold ?? 0.5,
      momentumFriction: config.momentumFriction ?? 0.95,
    };

    this.state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      lastX: 0,
      lastY: 0,
      velocityX: 0,
      velocityY: 0,
      lastTime: 0,
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
  }

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    const touch = e.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.updateDrag(touch.clientX, touch.clientY);
  };

  private handleTouchEnd = (): void => {
    this.endDrag();
  };

  private handleTouchCancel = (): void => {
    this.cancelDrag();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.startDrag(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      if (!this.state.isDragging) return;
      this.updateDrag(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = (): void => {
      this.endDrag();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  private startDrag(x: number, y: number): void {
    this.state.isDragging = true;
    this.state.startX = x;
    this.state.startY = y;
    this.state.currentX = x;
    this.state.currentY = y;
    this.state.lastX = x;
    this.state.lastY = y;
    this.state.velocityX = 0;
    this.state.velocityY = 0;
    this.state.lastTime = Date.now();

    // Cancel any ongoing momentum
    if (this.momentumRAF !== null) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }

    this.callbacks.onDragStart?.(x, y);
  }

  private updateDrag(x: number, y: number): void {
    if (!this.state.isDragging) return;

    const now = Date.now();
    const deltaTime = now - this.state.lastTime;

    if (deltaTime === 0) return;

    // Calculate raw delta
    let deltaX = x - this.state.lastX;
    let deltaY = y - this.state.lastY;

    // Apply axis constraints
    if (this.config.axis === 'x') {
      deltaY = 0;
    } else if (this.config.axis === 'y') {
      deltaX = 0;
    }

    // Calculate new position
    let newX = this.state.currentX + deltaX;
    let newY = this.state.currentY + deltaY;

    // Apply bounds with elasticity
    if (this.config.bounds.left !== undefined && newX < this.config.bounds.left) {
      const overflow = this.config.bounds.left - newX;
      newX = this.config.bounds.left - overflow * this.config.elasticity;
    }
    if (this.config.bounds.right !== undefined && newX > this.config.bounds.right) {
      const overflow = newX - this.config.bounds.right;
      newX = this.config.bounds.right + overflow * this.config.elasticity;
    }
    if (this.config.bounds.top !== undefined && newY < this.config.bounds.top) {
      const overflow = this.config.bounds.top - newY;
      newY = this.config.bounds.top - overflow * this.config.elasticity;
    }
    if (this.config.bounds.bottom !== undefined && newY > this.config.bounds.bottom) {
      const overflow = newY - this.config.bounds.bottom;
      newY = this.config.bounds.bottom + overflow * this.config.elasticity;
    }

    // Calculate velocity
    this.state.velocityX = deltaX / deltaTime;
    this.state.velocityY = deltaY / deltaTime;

    // Update state
    this.state.currentX = newX;
    this.state.currentY = newY;
    this.state.lastX = x;
    this.state.lastY = y;
    this.state.lastTime = now;

    this.callbacks.onDrag?.(newX, newY, deltaX, deltaY);
  }

  private endDrag(): void {
    if (!this.state.isDragging) return;

    this.state.isDragging = false;

    this.callbacks.onDragEnd?.(
      this.state.currentX,
      this.state.currentY,
      this.state.velocityX,
      this.state.velocityY
    );

    // Start momentum if enabled and velocity is above threshold
    if (
      this.config.momentum &&
      (Math.abs(this.state.velocityX) > this.config.momentumVelocityThreshold ||
        Math.abs(this.state.velocityY) > this.config.momentumVelocityThreshold)
    ) {
      this.startMomentum();
    }
  }

  private cancelDrag(): void {
    this.state.isDragging = false;
    if (this.momentumRAF !== null) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }
  }

  private startMomentum(): void {
    let velocityX = this.state.velocityX;
    let velocityY = this.state.velocityY;
    let x = this.state.currentX;
    let y = this.state.currentY;

    const animate = (): void => {
      // Apply friction
      velocityX *= this.config.momentumFriction;
      velocityY *= this.config.momentumFriction;

      // Update position
      x += velocityX * 16; // Assume 60fps (16ms per frame)
      y += velocityY * 16;

      // Apply bounds (hard stop at bounds during momentum)
      if (this.config.bounds.left !== undefined && x < this.config.bounds.left) {
        x = this.config.bounds.left;
        velocityX = 0;
      }
      if (this.config.bounds.right !== undefined && x > this.config.bounds.right) {
        x = this.config.bounds.right;
        velocityX = 0;
      }
      if (this.config.bounds.top !== undefined && y < this.config.bounds.top) {
        y = this.config.bounds.top;
        velocityY = 0;
      }
      if (this.config.bounds.bottom !== undefined && y > this.config.bounds.bottom) {
        y = this.config.bounds.bottom;
        velocityY = 0;
      }

      // Update state
      this.state.currentX = x;
      this.state.currentY = y;
      this.state.velocityX = velocityX;
      this.state.velocityY = velocityY;

      // Trigger callback
      this.callbacks.onDrag?.(x, y, velocityX * 16, velocityY * 16);

      // Continue animation if velocity is significant
      if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
        this.momentumRAF = requestAnimationFrame(animate);
      } else {
        this.momentumRAF = null;
        this.callbacks.onMomentumEnd?.(x, y);
      }
    };

    this.momentumRAF = requestAnimationFrame(animate);
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.element.removeEventListener('mousedown', this.handleMouseDown);

    if (this.momentumRAF !== null) {
      cancelAnimationFrame(this.momentumRAF);
      this.momentumRAF = null;
    }
  }

  public updateConfig(config: Partial<DragConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public updateCallbacks(callbacks: Partial<DragCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public getCurrentPosition(): { x: number; y: number } {
    return {
      x: this.state.currentX,
      y: this.state.currentY,
    };
  }

  public getVelocity(): { x: number; y: number } {
    return {
      x: this.state.velocityX,
      y: this.state.velocityY,
    };
  }
}
