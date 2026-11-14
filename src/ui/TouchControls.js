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
    btn.style.cssText = 'position:absolute;right:' + right + 'px;bottom:' + bottom + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.5);color:#fff;font-weight:bold;font-family:monospace;font-size:12px;pointer-events:auto;user-select:none;-webkit-user-select:none;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
    this.btnContainer.appendChild(btn);
    return btn;
  }

  _buildButtons() {
    this.btnFire = this._makeBtn('btn-fire', 'FIRE', 20, 20, 80);
    this.btnReload = this._makeBtn('btn-reload', 'RLD', 110, 20, 50);
    this.btnJump = this._makeBtn('btn-jump', 'JMP', 20, 110, 50);
    this.btnSwap = this._makeBtn('btn-swap', 'SWAP', 110, 80, 50);
  }

  _bindEvents() {
    this.joyZone.addEventListener('touchstart', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.input.touchJoystickStart(touch.clientX, touch.clientY);
    }, { passive: false });
    this.joyZone.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.input.touchJoystickMove(touch.clientX, touch.clientY);
    }, { passive: false });
    this.joyZone.addEventListener('touchend', e => {
      e.preventDefault();
      this.input.touchJoystickEnd();
    }, { passive: false });
    this.joyZone.addEventListener('touchcancel', () => this.input.touchJoystickEnd(), { passive: true });

    this.lookZone.addEventListener('touchstart', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.input.touchLookStart(touch.clientX, touch.clientY);
    }, { passive: false });
    this.lookZone.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.input.touchLookMove(touch.clientX, touch.clientY);
    }, { passive: false });
    this.lookZone.addEventListener('touchend', e => {
      e.preventDefault();
      this.input.touchLookEnd();
    }, { passive: false });
    this.lookZone.addEventListener('touchcancel', () => this.input.touchLookEnd(), { passive: true });

    const bindButton = (button, onDown, onUp) => {
      button.addEventListener('touchstart', event => {
        event.preventDefault();
        button.style.background = 'rgba(255,255,255,0.4)';
        onDown();
      }, { passive: false });
      button.addEventListener('touchend', event => {
        event.preventDefault();
        button.style.background = 'rgba(255,255,255,0.15)';
        if (onUp) onUp();
      }, { passive: false });
      button.addEventListener('touchcancel', () => {
        button.style.background = 'rgba(255,255,255,0.15)';
        if (onUp) onUp();
      }, { passive: true });
    };

    bindButton(this.btnFire, () => this.input.touchButtons.fire = true, () => this.input.touchButtons.fire = false);
    bindButton(this.btnReload, () => this.input.touchButtons.reload = true, () => this.input.touchButtons.reload = false);
    bindButton(this.btnJump, () => this.input.touchButtons.jump = true, () => this.input.touchButtons.jump = false);
    bindButton(this.btnSwap, () => this.input.touchButtons.switch = true, () => this.input.touchButtons.switch = false);
  }

  show() {
    if (this.input.isTouch) this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  destroy() {
    if (this.container.parentNode) this.container.parentNode.removeChild(this.container);
  }
}