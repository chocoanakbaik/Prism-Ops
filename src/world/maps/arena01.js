export const arena01 = {
  name: 'Choco Yard',
  bgColor: 0x0a0e1a,
  fogColor: 0x0a0e1a,
  fogNear: 10,
  fogFar: 100,
  groundColor: 0x1a2030,
  sunPosition: [30, 50, 20],
  perimeter: { size: 100, height: 6, color: 0x2a3545, thickness: 1 },
  covers: [
    { x: 0,   y: 1.25, z: -8,  w: 6, h: 2.5, d: 2, color: 0x3a4a5a },
    { x: -8,  y: 1.25, z: 0,   w: 2, h: 2.5, d: 6, color: 0x3a4a5a },
    { x: 8,   y: 1.25, z: 0,   w: 2, h: 2.5, d: 6, color: 0x3a4a5a },
    { x: 0,   y: 1.25, z: 8,   w: 6, h: 2.5, d: 2, color: 0x3a4a5a },
    { x: -18, y: 1.5,  z: -18, w: 5, h: 3, d: 5, color: 0x2f3f4f },
    { x: 18,  y: 1.5,  z: -18, w: 5, h: 3, d: 5, color: 0x2f3f4f },
    { x: -18, y: 1.5,  z: 18,  w: 5, h: 3, d: 5, color: 0x2f3f4f },
    { x: 18,  y: 1.5,  z: 18,  w: 5, h: 3, d: 5, color: 0x2f3f4f },
    { x: -32, y: 2,    z: 0,   w: 3, h: 4, d: 3, color: 0x25313f },
    { x: 32,  y: 2,    z: 0,   w: 3, h: 4, d: 3, color: 0x25313f },
    { x: 0,   y: 2,    z: -32, w: 3, h: 4, d: 3, color: 0x25313f },
    { x: 0,   y: 2,    z: 32,  w: 3, h: 4, d: 3, color: 0x25313f },
    { x: -25, y: 0.6,  z: -8,  w: 8, h: 1.2, d: 1, color: 0x3a4a5a },
    { x: 25,  y: 0.6,  z: 8,   w: 8, h: 1.2, d: 1, color: 0x3a4a5a },
    { x: -8,  y: 0.6,  z: -25, w: 1, h: 1.2, d: 8, color: 0x3a4a5a },
    { x: 8,   y: 0.6,  z: 25,  w: 1, h: 1.2, d: 8, color: 0x3a4a5a },
    { x: -38, y: 1,    z: -38, w: 4, h: 2, d: 4, color: 0x2f3f4f },
    { x: 38,  y: 1,    z: -38, w: 4, h: 2, d: 4, color: 0x2f3f4f },
    { x: -38, y: 1,    z: 38,  w: 4, h: 2, d: 4, color: 0x2f3f4f },
    { x: 38,  y: 1,    z: 38,  w: 4, h: 2, d: 4, color: 0x2f3f4f }
  ],
  decorations: [
    { x: 27,  z: 27,  height: 8, color: 0x00ff88 },
    { x: -27, z: 27,  height: 8, color: 0x00bbff },
    { x: 27,  z: -27, height: 8, color: 0xff4466 },
    { x: -27, z: -27, height: 8, color: 0xffaa00 }
  ],
  spawns: [
    { x: 0,   z: 30 }, { x: 30,  z: 0  }, { x: 0,   z: -30 }, { x: -30, z: 0  },
    { x: 20,  z: 20 }, { x: -20, z: 20 }, { x: 20,  z: -20 }, { x: -20, z: -20 }
  ]
};
