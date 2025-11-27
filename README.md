🌦️ Weather App

A simple and responsive weather application built with React, TypeScript, Material UI (MUI), and Lucide Icons.
The app fetches live weather data from Open-Meteo and displays conditions including temperature, wind speed, wind direction, and weather icons.

🚀 Features

🔎 Search weather by city

🌤️ Dynamic weather icons (clear sky, rain, snow, thunder, drizzle, etc.)

📍 Preloaded city list (e.g., Cape Town, New York, London, Tokyo…)

🎨 Fully responsive MUI layout

⚡ Fast TypeScript code with error handling

🌀 Loading spinner

🔔 Error alerts when city not found or API fails

🌡️ Automatic card background color (hot, cold, mild)

🛠️ Tech Stack

React 18

TypeScript

Material UI (MUI) v5

Lucide React icons

Open-Meteo API

Vite (if you're using it)

CSS / MUI SX styling

📦 Installation
npm install


or

yarn install


or

pnpm install

▶️ Development Server
npm run dev


Then open:

http://localhost:5173/

🏗️ Build for Production
npm run build

🌍 Supported Cities

The app includes coordinates for these cities:

New York

London

Tokyo

Cape Town

Sydney

Paris

Berlin

Moscow

Delhi

Beijing

You can easily add more inside:

const cityCoordinates = { ... }

📡 API Used

Weather data comes from:
https://open-meteo.com/

No API key required.

📁 Project Structure
src/
 ├── App.tsx        # Main weather component
 ├── main.tsx       # Entry point
 ├── index.css
 └── assets/

🧩 Future Improvements (Optional)

Auto-detect user location

Hourly & weekly forecast charts

Light/Dark theme

Add search autocomplete

Animated background depending on weather

📝 License

MIT License — free to use and modify.