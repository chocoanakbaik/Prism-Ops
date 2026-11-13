// ============================================
// HUD — Crosshair, HP, Ammo, Killfeed (B&W)
// ============================================

export class HUD {
  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'hud';
    this.el.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 100;
      display: none; font-family: monospace;
    `;
    this.el.innerHTML = `
      <!-- Crosshair -->
      <div id="crosshair" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;">
        <div style="position:absolute;left:9px;top:0;width:2px;height:100%;background:#fff;"></div>
        <div style="position:absolute;top:9px;left:0;width:100%;height:2px;background:#fff;"></div>
      </div>
      
      <!-- Top Center: Score -->
      <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);color:#fff;font-size:14px;letter-spacing:2px;">
        <span id="hud-kills" style="font-weight:bold;">0</span> KILLS · 
        <span id="hud-deaths" style="font-weight:bold;">0</span> DEATHS
      </div>

      <!-- Bottom Left: Health -->
      <div style="position:absolute;bottom:30px;left:30px;color:#fff;border-left:3px solid #fff;padding-left:10px;">
        <div style="font-size:10px;letter-spacing:1px;color:#aaa;">HEALTH</div>
        <div id="hud-hp" style="font-size:28px;font-weight:bold;">100</div>
      </div>

      <!-- Bottom Right: Ammo -->
      <div style="position:absolute;bottom:30px;right:30px;color:#fff;text-align:right;border-right:3px solid #fff;padding-right:10px;">
        <div style="font-size:10px;letter-spacing:1px;color:#aaa;">AMMO</div>
        <div id="hud-ammo" style="font-size:28px;font-weight:bold;">30</div>
      </div>

      <!-- Center Message (Death/Respawn) -->
      <div id="hud-msg" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:32px;font-weight:bold;letter-spacing:4px;display:none;text-shadow:0 0 10px #000;">
        ELIMINATED
      </div>
    `;
    document.body.appendChild(this.el);
    
    this.hpEl = this.el.querySelector('#hud-hp');
    this.ammoEl = this.el.querySelector('#hud-ammo');
    this.killsEl = this.el.querySelector('#hud-kills');
    this.deathsEl = this.el.querySelector('#hud-deaths');
    this.msgEl = this.el.querySelector('#hud-msg');
  }

  show() { this.el.style.display = 'block'; }
  hide() { this.el.style.display = 'none'; }

  update(player) {
    this.hpEl.textContent = Math.max(0, Math.round(player.hp));
    this.ammoEl.textContent = player.reloading ? '...' : player.ammo;
    this.killsEl.textContent = player.kills;
    this.deathsEl.textContent = player.deaths;

    if (player.hp <= 0) {
      this.msgEl.style.display = 'block';
    } else {
      this.msgEl.style.display = 'none';
    }
  }
}
