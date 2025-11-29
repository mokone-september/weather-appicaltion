import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Weather code mapping with weathericons.io CSS classes
const weatherCodeMap: { [key: number]: { description: string; iconClass: string } } = {
  0: { description: "Clear sky", iconClass: "wi wi-day-sunny" },
  1: { description: "Mainly clear", iconClass: "wi wi-day-sunny" },
  2: { description: "Partly cloudy", iconClass: "wi wi-day-cloudy" },
  3: { description: "Overcast", iconClass: "wi wi-cloudy" },
  45: { description: "Fog", iconClass: "wi wi-fog" },
  48: { description: "Depositing rime fog", iconClass: "wi wi-fog" },
  51: { description: "Light drizzle", iconClass: "wi wi-sprinkle" },
  53: { description: "Moderate drizzle", iconClass: "wi wi-sprinkle" },
  55: { description: "Dense drizzle", iconClass: "wi wi-rain" },
  61: { description: "Slight rain", iconClass: "wi wi-rain" },
  63: { description: "Moderate rain", iconClass: "wi wi-rain" },
  65: { description: "Heavy rain", iconClass: "wi wi-rain" },
  71: { description: "Slight snow", iconClass: "wi wi-snow" },
  73: { description: "Moderate snow", iconClass: "wi wi-snow" },
  75: { description: "Heavy snow", iconClass: "wi wi-snow" },
  80: { description: "Rain showers", iconClass: "wi wi-showers" },
  81: { description: "Rain showers", iconClass: "wi wi-showers" },
  82: { description: "Heavy showers", iconClass: "wi wi-showers" },
  85: { description: "Snow showers", iconClass: "wi wi-snow" },
  86: { description: "Heavy snow showers", iconClass: "wi wi-snow" },
  95: { description: "Thunderstorm", iconClass: "wi wi-thunderstorm" },
  96: { description: "Thunderstorm with hail", iconClass: "wi wi-storm-showers" },
  99: { description: "Heavy thunderstorm", iconClass: "wi wi-storm-showers" },
};

// City coordinate lookup
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

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("⚠️ Please enter a city name");
      setWeather(null);
      return;
    }

    if (trimmedCity.length < 2) {
      setError("⚠️ City name must be at least 2 characters");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const cityLower = trimmedCity.toLowerCase();
      const coordinates = cityCoordinates[cityLower];

      if (!coordinates) {
        setError(
          `❌ City "${trimmedCity}" not found. Try: New York, London, Tokyo, Sydney, Cape Town, Paris, Berlin, Moscow, Delhi, Beijing`
        );
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`
      );

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      if (!data.current_weather) throw new Error("No weather data received");

      setWeather(data.current_weather);
      setError("");
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        setError("🌐 Network error. Check your connection.");
      } else {
        setError("❌ Something went wrong. Try again.");
      }
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
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        py: 5,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Weather Forecast
      </Typography>

      {/* SEARCH BAR CARD */}
      <Card
        sx={{
          width: "100%",
          borderRadius: "16px",
          p: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Search Location
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter city, state or ZIP code..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
          disabled={loading}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={getWeather}
                  disabled={loading}
                  sx={{
                    background: "#e3f2fd",
                    "&:hover": { background: "#bbdefb" },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Suggested Location */}
        <Box
          mt={2}
          sx={{
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#f8f9fb",
            cursor: "pointer",
          }}
          onClick={() => setCity("San Francisco")}
        >
          <Typography fontWeight="bold">San Francisco, CA</Typography>
          <Typography fontSize="12px" color="text.secondary">
            37.7749, -122.4194
          </Typography>
        </Box>
      </Card>

      {/* ERRORS */}
      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}

      {/* WEATHER CARD */}
      {weather && (
        <Card
          sx={{
            width: "100%",
            mt: 2,
            backgroundColor: getCardBackground(),
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              gutterBottom
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              Current Weather in {city.charAt(0).toUpperCase() + city.slice(1)}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#E3F2FD",
                    fontSize: 60,
                    color: "#1976D2",
                  }}
                >
                  <i className={weatherCodeMap[weather.weathercode]?.iconClass} />
                </Box>
              </Box>

              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {Math.round(weather.temperature)}°C
                </Typography>
                <Typography color="text.secondary">Temperature</Typography>
              </Box>

              <Box textAlign="center">
                <Typography variant="h6">
                  {getDescription(weather.weathercode)}
                </Typography>
                <Typography color="text.secondary">Conditions</Typography>
              </Box>

              <Box textAlign="center">
                <Typography>{weather.windspeed.toFixed(1)} km/h</Typography>
                <Typography color="text.secondary">Wind Speed</Typography>
              </Box>

              <Box textAlign="center">
                <Typography fontWeight="bold">
                  {Math.round(weather.winddirection)}°
                </Typography>
                <Typography color="text.secondary">Wind Direction</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
