export class Input {
  constructor(domElement) {
    this.dom = domElement;
    this.keys = {};
    this.mouse = { left: false, right: false, dx: 0, dy: 0 };
    this.pointerLocked = false;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.joystick = { active: false, id: null, originX: 0, originY: 0, dx: 0, dy: 0 };
    this.look = { id: null, lastX: null, lastY: null };
    this.touchButtons = { fire: false, reload: false, sprint: false, aim: false, jump: false };
    this.onKey = null;
    this.onShoot = null;
    this.onReload = null;
    this.onPause = null;
    this.onLook = null;
    this._bind();
  }

  _bind() {
    window.addEventListener('keydown', e => this._keyEvent(e, true));
    window.addEventListener('keyup', e => this._keyEvent(e, false));
    window.addEventListener('blur', () => { this.keys = {}; });
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.dom;
    });
    document.addEventListener('mousemove', e => {
      if (!this.pointerLocked) return;
      if (this.onLook) this.onLook(e.movementX, e.movementY);
    });
    document.addEventListener('mousedown', e => {
      if (e.button === 0) { this.mouse.left = true; if (this.onShoot) this.onShoot(); }
    });
    document.addEventListener('mouseup', e => {
      if (e.button === 0) this.mouse.left = false;
    });
    document.addEventListener('contextmenu', e => e.preventDefault());
    if (this.dom) {
      this.dom.addEventListener('click', () => {
        if (!this.isTouch && !this.pointerLocked) this.dom.requestPointerLock();
      });
    }
  }

  _keyEvent(e, isDown) {
    const k = e.key.toLowerCase();
    this.keys[k] = isDown;
    if (this.onKey) this.onKey(k, isDown);
    if (isDown) {
      if (k === 'r' && this.onReload) this.onReload();
      if (k === 'escape' && this.onPause) this.onPause();
    }
  }

  touchJoystickStart(clientX, clientY) {
    this.joystick.active = true;
    this.joystick.originX = clientX;
    this.joystick.originY = clientY;
    this.joystick.dx = 0;
    this.joystick.dy = 0;
  }

  touchJoystickMove(clientX, clientY, maxD = 60) {
    if (!this.joystick.active) return;
    let dx = clientX - this.joystick.originX;
    let dy = clientY - this.joystick.originY;
    const dist = Math.hypot(dx, dy);
    if (dist > maxD) {
      dx = dx / dist * maxD;
      dy = dy / dist * maxD;
    }
    this.joystick.dx = dx;
    this.joystick.dy = dy;
  }

  touchJoystickEnd() {
    this.joystick.active = false;
    this.joystick.dx = 0;
    this.joystick.dy = 0;
  }

  touchLookStart(x, y) {
    this.look.lastX = x;
    this.look.lastY = y;
  }

  touchLookMove(x, y) {
    if (this.look.lastX == null) return;
    const dx = x - this.look.lastX;
    const dy = y - this.look.lastY;
    this.look.lastX = x;
    this.look.lastY = y;
    if (this.onLook) this.onLook(dx, dy);
  }

  touchLookEnd() {
    this.look.lastX = null;
    this.look.lastY = null;
  }

  destroy() {
    if (document.pointerLockElement) document.exitPointerLock();
  }
}
