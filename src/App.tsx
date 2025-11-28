import React, { useState, type ReactElement } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  Zap,
  EyeOff,
} from "lucide-react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

// Weather code mapping with icons
const weatherCodeMap: { [key: number]: { description: string; icon: ReactElement } } = {
  0: { description: "Clear sky", icon: <Sun size={40} color="#FFB74D" /> },
  1: { description: "Mainly clear", icon: <Sun size={40} color="#FFB74D" /> },
  2: { description: "Partly cloudy", icon: <Cloud size={40} color="#90A4AE" /> },
  3: { description: "Overcast", icon: <Cloud size={40} color="#78909C" /> },
  45: { description: "Fog", icon: <EyeOff size={40} color="#BDBDBD" /> },
  48: { description: "Depositing rime fog", icon: <EyeOff size={40} color="#BDBDBD" /> },
  51: { description: "Light drizzle", icon: <CloudDrizzle size={40} color="#64B5F6" /> },
  53: { description: "Moderate drizzle", icon: <CloudDrizzle size={40} color="#42A5F5" /> },
  55: { description: "Dense drizzle", icon: <CloudDrizzle size={40} color="#2196F3" /> },
  61: { description: "Slight rain", icon: <CloudRain size={40} color="#64B5F6" /> },
  63: { description: "Moderate rain", icon: <CloudRain size={40} color="#42A5F5" /> },
  65: { description: "Heavy rain", icon: <CloudRain size={40} color="#2196F3" /> },
  71: { description: "Slight snow fall", icon: <CloudSnow size={40} color="#E3F2FD" /> },
  73: { description: "Moderate snow fall", icon: <CloudSnow size={40} color="#BBDEFB" /> },
  75: { description: "Heavy snow fall", icon: <CloudSnow size={40} color="#90CAF9" /> },
  80: { description: "Slight rain showers", icon: <CloudRain size={40} color="#64B5F6" /> },
  81: { description: "Moderate rain showers", icon: <CloudRain size={40} color="#42A5F5" /> },
  82: { description: "Violent rain showers", icon: <CloudRain size={40} color="#2196F3" /> },
  95: { description: "Thunderstorm", icon: <Zap size={40} color="#FFD54F" /> },
  96: { description: "Thunderstorm with slight hail", icon: <Zap size={40} color="#FFB74D" /> },
  99: { description: "Thunderstorm with heavy hail", icon: <Zap size={40} color="#FF9800" /> },
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  type Weather = {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time?: string;
  };

  const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
    "new york": { lat: 40.7128, lon: -74.006 },
    london: { lat: 51.5074, lon: -0.1278 },
    tokyo: { lat: 35.6762, lon: 139.6503 },
    sydney: { lat: -33.8688, lon: 151.2093 },
    "cape town": { lat: -33.9249, lon: 18.4241 },
    paris: { lat: 48.8566, lon: 2.3522 },
    berlin: { lat: 52.52, lon: 13.405 },
    moscow: { lat: 55.7558, lon: 37.6173 },
    delhi: { lat: 28.7041, lon: 77.1025 },
    beijing: { lat: 39.9042, lon: 116.4074 },
  };

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cityLower = city.toLowerCase().trim();
      const coordinates = cityCoordinates[cityLower];

      if (!coordinates) {
        setError(`City "${city}" not found. Try: New York, London, Tokyo, etc.`);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`
      );

      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDescription = (code: number) =>
    weatherCodeMap[code]?.description ?? `Weather code: ${code}`;

  const getCardBackground = () => {
    if (!weather) return "#fff";
    if (weather.temperature >= 30) return "#FFECB3";
    if (weather.temperature <= 10) return "#BBDEFB";
    return "#E0F7FA";
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: 3,
        py: 4,
      }}
    >
      <Typography variant="h3" textAlign="center" fontWeight="bold">
        Weather App
      </Typography>

      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <TextField
          fullWidth
          label="Enter city"
          variant="outlined"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (!e.target.value.trim()) setWeather(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
          disabled={loading}
          autoFocus
        />
        <Button
          variant="contained"
          disabled={loading}
          onClick={getWeather}
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}

      {weather && (
        <Card sx={{ width: "100%", mt: 2, backgroundColor: getCardBackground() }}>
          <CardContent>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Current Weather in {city.charAt(0).toUpperCase() + city.slice(1)}
            </Typography>

            <Grid container spacing={2} justifyContent="center" alignItems="center">

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#E3F2FD",
                  }}
                >
                  {weatherCodeMap[weather.weathercode]?.icon}
                </Box>
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {weather.temperature}°C
                </Typography>
                <Typography color="text.secondary">Temperature</Typography>
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <Typography variant="h6">{getDescription(weather.weathercode)}</Typography>
                <Typography color="text.secondary">Conditions</Typography>
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <Typography>{weather.windspeed} km/h</Typography>
                <Typography color="text.secondary">Wind Speed</Typography>
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <Typography>{weather.winddirection}°</Typography>
                <Typography color="text.secondary">Wind Direction</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
