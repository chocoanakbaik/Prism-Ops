# Prism Ops

**Prism Ops** is a browser-based first-person shooter prototype developed by **Vornika+**, the game-development unit within The Choco Studios (TCS) ecosystem. The repository name and game title remain Prism Ops; the former Vornika+ name is now Vornika+.

## Current implementation

The current source includes:

- Three.js scene and renderer setup.
- A procedural arena with ground, perimeter walls, cover objects, decorations, and collision geometry.
- First-person player movement, look controls, sprinting, jumping, health, death, and respawn behavior.
- Desktop keyboard/mouse input and touch controls.
- Bot entities with configurable difficulty in the game runtime.
- Pistol and rifle weapon modules with a weapon manager.
- HUD, match loop, audio module, and a graphics preset system.

This describes the implementation found in the repository. It does not imply that every gameplay loop, menu, progression feature, multiplayer feature, or platform release is complete.

## Technology

- Vite for development and production builds.
- JavaScript ES modules.
- Three.js for 3D rendering.
- CSS for the interface and HUD.

## Requirements

- Node.js 20.19.0 or newer.
- npm.
- A browser with WebGL support.

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project structure

- `src/core/`: game lifecycle, input, audio, and update loop.
- `src/world/`: scene, arena, collision, environment, and map data.
- `src/entities/`: player and bot entities.
- `src/weapons/`: pistol, rifle, and weapon selection.
- `src/ui/`: HUD and touch controls.
- `ROADMAP.md`: planned gameplay and technical improvements.

## Verification and release status

The current package scripts provide development, production build, and preview commands. There is no automated test script in `package.json` at this revision. A successful Vite build alone does not verify gameplay balance, controls on physical devices, performance, or release readiness.

The project should be treated as a development prototype. It is not documented as a Microsoft Store release or a completed commercial game.

## Vornika+ and TCS

Vornika+ is the TCS game-development unit that voluntarily joined the TCS ecosystem from an independent origin. The previous name Vornika+ is retained only as historical context.

**Studio tagline:** *Play Beyond the Ordinary.*

