# 🌦️ Weather App

A simple, responsive weather application built with React, TypeScript, Material UI (MUI), and Lucide icons. The app fetches live weather data from Open-Meteo and displays current conditions (temperature, wind, weather icons) for searched or preloaded cities.

## Features

- Search weather by city
- Responsive MUI layout
- Dynamic weather icons (clear, rain, snow, thunder, drizzle, etc.)
- Preloaded city list (e.g., Cape Town, New York, London, Tokyo)
- Loading spinner and error alerts
- Automatic card background color based on temperature

## Tech stack

- React 18
- TypeScript
- Vite
- Material UI (MUI) v5
- Lucide React icons
- Open-Meteo API (no API key required)

## Quick start

Prerequisites: Node.js (16+ recommended) and a package manager (npm, yarn, or pnpm).

Install dependencies:

```bash
# npm
npm install

# or yarn
# 🌦️ Weather App

A simple, responsive weather application built with React, TypeScript, Material UI (MUI), and Lucide icons. The app fetches live weather data from Open-Meteo and displays current conditions (temperature, wind, weather icons) for searched or preloaded cities.

## Features

- Search weather by city
- Responsive MUI layout
- Dynamic weather icons (clear, rain, snow, thunder, drizzle, etc.)
- Preloaded city list (e.g., Cape Town, New York, London, Tokyo)
- Loading spinner and error alerts
- Automatic card background color based on temperature

## Tech stack

- React 18
- TypeScript
- Vite
- Material UI (MUI) v5
- Lucide React icons
- Open-Meteo API (no API key required)

## Quick start

Prerequisites: Node.js (16+ recommended) and a package manager (npm, yarn, or pnpm).

Install dependencies:

```bash
# npm
npm install

# or yarn
yarn

# or pnpm
pnpm install
```

Run the development server:

```bash
npm run dev
# open http://localhost:5173
```

Build for production:

```bash
npm run build
```

## Troubleshooting: "Cannot find namespace 'JSX'"

If TypeScript reports "Cannot find namespace 'JSX'", it's usually because the compiler can't find the React JSX type definitions or `tsconfig` isn't configured for the JSX runtime. Try the steps below:

1. Install React type definitions (dev dependencies):

```bash
npm install --save-dev @types/react @types/react-dom
```

1. Check your `tsconfig.json` `compilerOptions`. For React 17+ with the new JSX runtime use:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

If your project uses the classic runtime (older React or manual `import React`), set `"jsx": "react"` instead.

1. If `tsconfig.json` contains a `types` array, make sure it does not exclude the default DOM/react types. Either add `"react"` and `"react-dom"` to it or remove the `types` array to allow automatic discovery.

1. After making changes, restart the TypeScript server in your editor (Command Palette → "TypeScript: Restart TS Server") and restart the dev server.

If you want, I can make these changes automatically (install packages and show the exact `tsconfig.json` diff) — tell me which package manager you use.

## Project structure (key files)

```text
src/
 ├── App.tsx        # Main weather component
 ├── main.tsx       # Entry / boot
 ├── index.css
 └── assets/
```

## Supported / preloaded cities

New York, London, Tokyo, Cape Town, Sydney, Paris, Berlin, Moscow, Delhi, Beijing — coordinates are stored in the source (see `App.tsx`).

## Contributing

Contributions welcome. Open an issue or PR with a short description of your change.

## License

MIT License — free to use and modify.
