import { useState } from "react";
import { FiSearch } from "react-icons/fi";

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;

    const response = await fetch(
      `http://localhost:8080/weather?city=${city}`
    );

    const json = await response.json();
    setData(json);
  };

  return (
    <div className="min-h-screen w-full bg-[#E3F2FD] flex flex-col items-center pt-10">
      <h1 className="text-3xl mb-8 font-bold">☀️ Weather Forecast</h1>

      {/* Search Box */}
      <div className="bg-white/60 p-6 rounded-3xl shadow-lg w-[500px] max-w-[90%] backdrop-blur">
        <label className="font-bold">Search Location</label>

        <div className="mt-2 flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 outline-none font-bold"
          />
          <button
            onClick={fetchWeather}
            className="p-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      {/* Weather Card */}
      {data && (
        <div className="bg-white/60 mt-10 p-10 rounded-3xl shadow-lg w-[600px] max-w-[90%] backdrop-blur text-center">
          <h2 className="text-2xl mb-4 font-bold">{data.name}</h2>

          <div className="text-6xl mb-6 font-bold">☀️</div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-bold">{data.main.temp}°C</p>
              <p className="text-gray-700 font-bold">Temperature</p>
            </div>

            <div>
              <p className="text-xl font-bold">{data.weather[0].description}</p>
              <p className="text-gray-700 font-bold">Conditions</p>
            </div>

            <div>
              <p className="text-xl font-bold">{data.wind.speed} km/h</p>
              <p className="text-gray-700 font-bold">Wind Speed</p>
            </div>

            <div>
              <p className="text-xl font-bold">{data.wind.deg}°</p>
              <p className="text-gray-700 font-bold">Wind Direction</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
