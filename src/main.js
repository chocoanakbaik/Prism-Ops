// ============================================
// Prism Ops — Entry Point
// ============================================

import { Game } from './core/Game.js';
import { APP } from './constants.js';
import './styles/main.css';

console.log(`[${APP.name}] v${APP.version} — booting…`);

const root = document.getElementById('app');
if (!root) {
  throw new Error('[main] Missing #app root element in index.html');
}

const game = new Game(root);
window.__prismGame = game;

game.boot().catch(err => {
  console.error('[main] boot failed:', err);
  root.innerHTML = `
    <div style="color:#ff4466;font-family:monospace;padding:24px;font-size:14px">
      <h2>Boot Error</h2>
      <pre style="color:#fff;white-space:pre-wrap">${err.message}\n\n${err.stack || ''}</pre>
    </div>
  `;
});
