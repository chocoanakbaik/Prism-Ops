// ============================================
// Game Loop — requestAnimationFrame wrapper
// ============================================

export class Loop {
  constructor(tickFn) {
    this.tickFn = tickFn;
    this.running = false;
    this.lastTime = 0;
    this.rafId = null;
    this.maxDt = 0.05;
    this.fps = 0;
    this._fpsAccum = 0;
    this._fpsFrames = 0;
    this._bound = this._loop.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._bound);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _loop(now) {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, this.maxDt);
    this.lastTime = now;
    this._fpsAccum += dt;
    this._fpsFrames++;
    if (this._fpsAccum >= 0.5) {
      this.fps = Math.round(this._fpsFrames / this._fpsAccum);
      this._fpsAccum = 0;
      this._fpsFrames = 0;
    }
    try {
      this.tickFn(dt, now);
    } catch (err) {
      console.error('[Loop] tick error:', err);
    }
    this.rafId = requestAnimationFrame(this._bound);
  }
}
