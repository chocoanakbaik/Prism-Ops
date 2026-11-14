export class TouchControls {
  constructor(input) {
    this.input = input;
    this.container = document.createElement('div');
    this.container.id = 'touch-controls';
    this.container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;display:none;';
    document.body.appendChild(this.container);

    this.joyZone = document.createElement('div');
    this.joyZone.style.cssText = 'position:absolute;left:0;top:15%;bottom:0;width:50%;pointer-events:auto;touch-action:none;';
    this.container.appendChild(this.joyZone);

    this.lookZone = document.createElement('div');
    this.lookZone.style.cssText = 'position:absolute;right:0;top:15%;bottom:20%;width:50%;pointer-events:auto;touch-action:none;';
    this.container.appendChild(this.lookZone);

    this.btnContainer = document.createElement('div');
    this.btnContainer.style.cssText = 'position:absolute;right:20px;bottom:20px;width:200px;height:200px;pointer-events:none;';
    this.container.appendChild(this.btnContainer);

    this._buildButtons();
    this._bindEvents();
  }

  _makeBtn(id, text, right, bottom, size) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = text;
    btn.style.cssText = `position:absolute;right:${right}px;bottom:${bottom}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.5);color:#fff;font-weight:bold;font-family:monospace;font-size:12px;pointer-events:auto;user-select:none;-webkit-user-select:none;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);`;
    this.btnContainer.appendChild(btn);
    return btn;
  }

  _buildButtons() {
    this.btnFire = this._makeBtn('btn-fire', 'FIRE', 20, 20, 80);
    this.btnReload = this._makeBtn('btn-reload', 'RLD', 110, 20, 50);
    this.btnJump = this._makeBtn('btn-jump', 'JMP', 20, 110, 50);
  }

  _bindEvents() {
    this.joyZone.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this.input.touchJoystickStart(t.clientX, t.clientY);
    }, { passive: false });
    this.joyZone.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this.input.touchJoystickMove(t.clientX, t.clientY);
    }, { passive: false });
    this.joyZone.addEventListener('touchend', e => {
      e.preventDefault();
      this.input.touchJoystickEnd();
    }, { passive: false });

    this.lookZone.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this.input.touchLookStart(t.clientX, t.clientY);
    }, { passive: false });
    this.lookZone.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this.input.touchLookMove(t.clientX, t.clientY);
    }, { passive: false });
    this.lookZone.addEventListener('touchend', e => {
      e.preventDefault();
      this.input.touchLookEnd();
    }, { passive: false });

    const bindBtn = (btn, onDown, onUp) => {
      btn.addEventListener('touchstart', e => {
        e.preventDefault();
        btn.style.background = 'rgba(255,255,255,0.4)';
        onDown();
      }, { passive: false });
      btn.addEventListener('touchend', e => {
        e.preventDefault();
        btn.style.background = 'rgba(255,255,255,0.15)';
        if (onUp) onUp();
      }, { passive: false });
      btn.addEventListener('touchcancel', e => {
        btn.style.background = 'rgba(255,255,255,0.15)';
        if (onUp) onUp();
      }, { passive: false });
    };

    bindBtn(this.btnFire, () => this.input.touchButtons.fire = true, () => this.input.touchButtons.fire = false);
    bindBtn(this.btnReload, () => this.input.touchButtons.reload = true, () => this.input.touchButtons.reload = false);
    bindBtn(this.btnJump, () => this.input.touchButtons.jump = true, () => this.input.touchButtons.jump = false);
  }

  show() {
    if (this.input.isTouch) this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
