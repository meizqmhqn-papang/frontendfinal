"use strict";
$(function () {
    const endpoint = "https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FAlmaty";
    const descriptions = {0:"Clear skies",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Freezing fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",56:"Freezing drizzle",57:"Freezing drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",66:"Freezing rain",67:"Freezing rain",71:"Light snow",73:"Snow",75:"Heavy snow",77:"Snow grains",80:"Light showers",81:"Rain showers",82:"Heavy showers",85:"Snow showers",86:"Heavy snow showers",95:"Thunderstorm",96:"Thunderstorm with hail",99:"Thunderstorm with hail"};
    async function loadWeather() {
        $("#weatherRefresh").prop("disabled",true); $("#weatherStatus").text("Loading local weather…").prop("hidden",false); $("#weatherData").prop("hidden",true);
        try {
            const response = await fetch(endpoint, {signal: AbortSignal.timeout(8000)});
            if (!response.ok) throw new Error("Weather request failed");
            const {current, current_units} = await response.json();
            if (!Number.isFinite(current?.temperature_2m) || !Number.isFinite(current?.wind_speed_10m)) throw new Error("Invalid weather data");
            $("#weatherTemp").text(Math.round(current.temperature_2m) + " " + (current_units?.temperature_2m || "°C"));
            $("#weatherCondition").text(descriptions[current.weather_code] || "Current conditions");
            $("#weatherWind").text("Wind: " + Math.round(current.wind_speed_10m) + " " + (current_units?.wind_speed_10m || "km/h"));
            $("#weatherStatus").prop("hidden",true); $("#weatherData").prop("hidden",false);
        } catch { $("#weatherStatus").text("Weather is temporarily unavailable."); }
        finally { $("#weatherRefresh").prop("disabled",false); }
    }
    $("#weatherRefresh").on("click",loadWeather); loadWeather();
});
