export class Audio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.volumes = { master: 0.7, sfx: 0.8 };
    this._unlocked = false;
  }
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    this._applyVolumes();
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  _applyVolumes() {
    if (!this.ctx) return;
    this.masterGain.gain.value = this.volumes.master;
    this.sfxGain.gain.value = this.volumes.sfx;
  }
  play(type, volume = 0.3) {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    if (this.volumes.master * this.volumes.sfx <= 0) return;
    const now = this.ctx.currentTime;
    switch (type) {
      case 'gunshot': {
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
        gain.gain.value = volume;
        src.connect(filter).connect(gain).connect(this.sfxGain);
        src.start(now);
        break;
      }
      case 'hit': {
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 880;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now); osc.stop(now + 0.08);
        break;
      }
    }
  }
}