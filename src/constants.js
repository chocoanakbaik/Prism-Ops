// ============================================
// PRISM OPS — Global Constants (Black & White)
// ============================================

export const APP = {
  name: 'Prism Ops',
  version: '0.4.0',
  studio: 'Prism Gaming Studios'
};

export const PLAYER_CFG = {
  speed: 6,
  sprintMultiplier: 1.65,
  jumpForce: 7,
  gravity: 22,
  height: 1.7,
  radius: 0.45,
  maxHP: 100,
  maxAmmo: 30,
  respawnTime: 3
};

export const WEAPON_CFG = {
  fireRate: 0.095,
  damage: 24,
  range: 120,
  spread: 0.008,
  recoil: 0.04,
  reloadTime: 2.2
};

export const CAMERA_CFG = {
  fov: 78,
  near: 0.1,
  far: 400,
  mouseSensitivity: 0.0022,
  touchSensitivity: 0.004,
  arrowLookSpeed: 2.2
};

export const ARENA_CFG = {
  size: 100,
  wallHeight: 6,
  fogColor: 0x0a0a0a,
  bgColor: 0x0a0a0a
};

export const GRAPHICS_PRESETS = {
  low:    { renderScale: 0.75, shadows: false, antialias: false, fogFar: 70 },
  medium: { renderScale: 1.0,  shadows: false, antialias: false, fogFar: 100 },
  high:   { renderScale: 1.25, shadows: true,  antialias: true,  fogFar: 130 },
  ultra:  { renderScale: 2.0,  shadows: true,  antialias: true,  fogFar: 180 }
};

export const BOT_NAMES = [
  'Liang Hwang', 'Lie Chan', 'Wei Zhang', 'Chen Wei', 'Kim Min-jun',
  'Yuki Tanaka', 'Takeshi Sato', 'Park Ji-ho', 'Nakamura Kenji', 'Liu Yang',
  'Zhao Wei', 'Hiroshi Ito', 'Kang Dae-ho', 'Sun Wei', 'Park Min-seo',
  'Wang Lei', 'Feng Yu', 'Kobayashi Aoi', 'Jung Ho-seok', 'Sato Rin',
  'Xiao Long', 'Han Bin', 'Choi Ye-jun', 'Yamada Hana', 'Tanaka Yui'
];

export const BOT_DIFFICULTY = {
  1: { hp: 100, speed: 3.2, accuracy: 0.30, reactionTime: 0.65, fireRate: 0.70, damage: 8,  viewRange: 45, label: 'MUDAH' },
  2: { hp: 120, speed: 3.9, accuracy: 0.45, reactionTime: 0.50, fireRate: 0.60, damage: 12, viewRange: 55, label: 'SEDANG' },
  3: { hp: 140, speed: 4.6, accuracy: 0.60, reactionTime: 0.38, fireRate: 0.50, damage: 16, viewRange: 65, label: 'SULIT' },
  4: { hp: 160, speed: 5.3, accuracy: 0.75, reactionTime: 0.28, fireRate: 0.42, damage: 20, viewRange: 75, label: 'VERY HARD' },
  5: { hp: 200, speed: 6.0, accuracy: 0.90, reactionTime: 0.18, fireRate: 0.35, damage: 25, viewRange: 90, label: 'NIGHTMARE' }
};

export const BOT_STATES = {
  PATROL: 'PATROL',
  HUNT: 'HUNT',
  ATTACK: 'ATTACK'
};
