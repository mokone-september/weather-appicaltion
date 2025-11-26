import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
} from "@mui/material";

export default function App() {
  const [city, setCity] = useState("");

  type Weather = {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time?: string;
  };

  const [weather, setWeather] = useState<Weather | null>(null);

  const getWeather = async () => {
    if (!city) return;

    // Example: using open-meteo API for demo
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=-26.2&longitude=28.0&current_weather=true`
    );
    const data = await res.json();
    setWeather(data.current_weather);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Weather App
      </Typography>

      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <TextField
          fullWidth
          label="Enter city"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button variant="contained" onClick={getWeather}>
          Search
        </Button>
      </Box>

      {weather && (
        <Card sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Current Weather
            </Typography>
            <Typography>Temperature: {weather.temperature}°C</Typography>
            <Typography>Wind: {weather.windspeed} km/h</Typography>
            <Typography>Weather Code: {weather.weathercode}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
