# Prism Ops

**A first-person shooter project developed within Vornika+-, the game-development unit of The Choco Studios (TCS).**

The repository name is retained for historical continuity. Vornika+- is the current game-development identity; Prism Gaming Studios is its previous name.

## About the project

Prism Ops is an early first-person shooter project. This repository currently contains the initial tooling and deployment foundation, not a completed game.

Gameplay systems, assets, engine selection, supported platforms, technical requirements, and release details must be documented only after they have been implemented and verified.

## Technology foundation

The current repository foundation uses:

- **Vite** for the development server and production build.
- **JavaScript ES modules** for project configuration.
- **Vercel** deployment configuration for the Vite build output.

The game engine, rendering stack, and gameplay architecture have not yet been specified in this repository.

## Getting started

### Requirements

- Node.js 20.19.0 or newer.
- npm.

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Environment variables

Copy `.env.example` to `.env.local` when local environment configuration is needed.

Only variables prefixed with `VITE_` are exposed to browser-side code. Never put private keys, passwords, or server secrets in Vite client-side environment variables.

## Project structure

```text
.
├── public/
│   └── favicon.svg
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
```

## Project status

The repository currently contains the initial tooling and deployment foundation. It does not yet contain implemented FPS gameplay, game assets, or a selected game engine. A successful Vite build must not be described as a playable game release.

## Ecosystem

- **Game-development unit:** Vornika+-
- **Ecosystem:** The Choco Studios
- **Project:** Prism Ops
- **Historical unit name:** Prism Gaming Studios

**Vornika+- — Play Beyond the Ordinary.**
