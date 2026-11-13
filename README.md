# Prism Vanguard

**A first-person shooter game by Prism Gaming Studios.**

Prism Vanguard is a first-person shooter project developed by **Prism Gaming Studios**, an independent game studio within the **The Choco Studios (TCS) ecosystem**.

## About the Project

This repository contains the foundation and future development materials for Prism Vanguard, including its application source, game systems, assets, and documentation as those components are implemented.

The project is being developed incrementally. Gameplay features, supported platforms, technical requirements, and release details will be documented only after they have been established and verified.

## Technology Foundation

The initial project foundation uses:

- **Vite** for the development server and production build.
- **JavaScript ES modules** for project configuration.
- **Vercel** deployment configuration for the Vite build output.

The game engine, rendering stack, and gameplay architecture have not yet been specified in this repository.

## Getting Started

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

## Environment Variables

Copy `.env.example` to `.env.local` when local environment configuration is needed.

Only variables prefixed with `VITE_` are exposed to browser-side code. Never put private keys, passwords, or server secrets in Vite client-side environment variables.

## Project Structure

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

## Studio

**Prism Gaming Studios** is an independent game studio within the TCS ecosystem, with its own identity and creative direction.

**Studio tagline:** *Play Beyond the Ordinary.*

## Project Status

The repository currently contains the initial tooling and deployment foundation. It does not yet contain implemented FPS gameplay, game assets, or a selected game engine.

## Ecosystem

- **Studio:** Prism Gaming Studios
- **Ecosystem:** The Choco Studios
- **Project:** Prism Vanguard
