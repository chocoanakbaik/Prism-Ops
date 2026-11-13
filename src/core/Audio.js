// ============================================
// Procedural Audio — Web Audio API
// ============================================

export class Audio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.volumes = { master: 0.7, sfx: 0.8, music: 0.4 };
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { console.warn('[Audio] Web Audio not supported'); return; }
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.sfxGain    = this.ctx.createGain();
    this.musicGain  = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);
    this.musicGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    this._applyVolumes();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setVolume(kind, value) {
    this.volumes[kind] = Math.max(0, Math.min(1, value));
    this._applyVolumes();
  }

  _applyVolumes() {
    if (!this.ctx) return;
    this.masterGain.gain.value = this.volumes.master;
    this.sfxGain.gain.value = this.volumes.sfx;
    this.musicGain.gain.value = this.volumes.music;
  }

  play(type, volume = 0.3) {
    if (!this.ctx) return;
    if (this.volumes.master * this.volumes.sfx <= 0) return;
    const now = this.ctx.currentTime;
    switch (type) {
      case 'gunshot':   this._gunshot(now, volume); break;
      case 'hit':       this._tone(now, 880, 0.08, 'square', volume * 0.3); break;
      case 'kill':      this._kill(now, volume); break;
      case 'reload':    this._reload(now, volume); break;
      case 'empty':     this._tone(now, 200, 0.05, 'square', volume * 0.2); break;
      case 'hitmarker': this._tone(now, 1400, 0.04, 'sine', volume * 0.25); break;
      case 'footstep':  this._footstep(now, volume * 0.15); break;
      case 'hurt':      this._hurt(now, volume); break;
    }
  }

  _gunshot(now, vol) {
    const dur = 0.12;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter).connect(gain).connect(this.sfxGain);
    src.start(now);
  }

  _tone(now, freq, dur, wave, vol) {
    const osc = this.ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + dur);
  }

  _kill(now, vol) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  _reload(now, vol) {
    this._tone(now, 600, 0.06, 'square', vol * 0.2);
    this._tone(now + 0.1, 400, 0.08, 'square', vol * 0.2);
    this._tone(now + 0.25, 700, 0.06, 'square', vol * 0.2);
  }

  _footstep(now, vol) {
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 4) * 0.5;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter).connect(gain).connect(this.sfxGain);
    src.start(now);
  }

  _hurt(now, vol) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}
