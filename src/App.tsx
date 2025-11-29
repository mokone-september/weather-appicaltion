import { useState, useEffect, useMemo } from "react";
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

// ----------------------------------------
// Weather code mapping
// ----------------------------------------
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

// ----------------------------------------
// Coordinates
// ----------------------------------------
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

// ----------------------------------------
// Weather type
// ----------------------------------------
interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Autofocus search field
  useEffect(() => {
    document.getElementById("city-input")?.focus();
  }, []);

  // Load last city
  useEffect(() => {
    const last = localStorage.getItem("lastCity");
    if (last) setCity(last);
  }, []);

  // Save last searched city
  useEffect(() => {
    if (weather) localStorage.setItem("lastCity", city);
  }, [weather]);

  const getWeather = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    if (trimmedCity.length < 2) {
      setError("City name must be at least 2 characters.");
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
          `City "${trimmedCity}" not found. Try: New York, London, Tokyo, Sydney, Cape Town, Paris, Berlin, Moscow, Delhi, Beijing`
        );
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`
      );

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      if (!data.current_weather) throw new Error("No weather data");

      setWeather(data.current_weather);
    } catch (err: any) {
      setError("Unable to load weather details. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const description = useMemo(
    () => weather && weatherCodeMap[weather.weathercode]?.description,
    [weather]
  );

  const cityLabel =
    city.trim().charAt(0).toUpperCase() + city.trim().slice(1);

  // suggestions
  const suggestions = Object.keys(cityCoordinates).filter((c) =>
    c.startsWith(city.toLowerCase())
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        py: 6,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        transition: "background-image 0.8s",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
      🌤️ Weather Forecast
      </Typography>

      {/* SEARCH BAR */}
      <Card
        sx={{
          p: 3,
          borderRadius: "18px",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.25)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Typography fontWeight={600} mb={1.5}>
          Search Location
        </Typography>

        <TextField
          id="city-input"
          fullWidth
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "14px" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={getWeather}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    "&:hover": { backgroundColor: "#bbdefb" },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Suggestions */}
        {city.length > 0 && suggestions.length > 0 && (
          <Box mt={2} sx={{ borderTop: "1px solid #eee" }}>
            {suggestions.slice(0, 5).map((name) => (
              <Box
                key={name}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => {
                  setCity(name);
                  getWeather();
                }}
              >
                {name.toUpperCase()}
              </Box>
            ))}
          </Box>
        )}
      </Card>

      {/* ERRORS */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: "14px" }}>
          {error}
        </Alert>
      )}

      {/* WEATHER CARD */}
      {weather && (
        <Card
          sx={{
            borderRadius: "20px",
            backgroundColor:
              weather.temperature >= 30
                ? "#FFECB3"
                : weather.temperature <= 10
                ? "#BBDEFB"
                : "#E0F7FA",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.6s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              fontWeight={600}
              textAlign="center"
              gutterBottom
            >
              {cityLabel}
            </Typography>

            {/* Weather Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: { xs: 100, sm: 130 },
                  height: { xs: 100, sm: 130 },
                  borderRadius: "50%",
                  backgroundColor: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: 70, sm: 90 },
                  color: "#1976D2",
                }}
              >
                <i className={weatherCodeMap[weather.weathercode]?.iconClass} />
              </Box>
            </Box>

            {/* Weather Details */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                textAlign: "center",
              }}
            >
              <Box>
                <Typography variant="h3" fontWeight="700">
                  {Math.round(weather.temperature)}°C
                </Typography>
                <Typography color="text.secondary">Temperature</Typography>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={500}>
                  {description}
                </Typography>
                <Typography color="text.secondary">Conditions</Typography>
              </Box>

              <Box>
                <Typography variant="h6">
                  {weather.windspeed.toFixed(1)} km/h
                </Typography>
                <Typography color="text.secondary">Wind Speed</Typography>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight="600">
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
