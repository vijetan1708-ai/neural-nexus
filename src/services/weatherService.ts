import { CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isSimulated: boolean;
}

export class WeatherService {
  /**
   * Translate WMO Weather Interpretation Codes (WW) to human-readable strings
   */
  static decodeWMOCode(code: number): { condition: string; icon: string } {
    switch (code) {
      case 0: return { condition: 'Clear Sky', icon: 'sun' };
      case 1: return { condition: 'Mainly Clear', icon: 'sun' };
      case 2: return { condition: 'Partly Cloudy', icon: 'cloud-sun' };
      case 3: return { condition: 'Overcast', icon: 'cloud' };
      case 45: return { condition: 'Fog', icon: 'cloud-fog' };
      case 48: return { condition: 'Depositing Rime Fog', icon: 'cloud-fog' };
      case 51: return { condition: 'Light Drizzle', icon: 'cloud-drizzle' };
      case 53: return { condition: 'Moderate Drizzle', icon: 'cloud-drizzle' };
      case 55: return { condition: 'Dense Drizzle', icon: 'cloud-drizzle' };
      case 61: return { condition: 'Slight Rain', icon: 'cloud-rain' };
      case 63: return { condition: 'Moderate Rain', icon: 'cloud-rain' };
      case 65: return { condition: 'Heavy Rain', icon: 'cloud-rain' };
      case 80: return { condition: 'Slight Rain Showers', icon: 'cloud-rain' };
      case 81: return { condition: 'Moderate Showers', icon: 'cloud-rain' };
      case 82: return { condition: 'Violent Rain Showers', icon: 'cloud-lightning' };
      case 95: return { condition: 'Thunderstorm', icon: 'cloud-lightning' };
      case 96: return { condition: 'Thunderstorm with Slight Hail', icon: 'cloud-lightning' };
      case 99: return { condition: 'Severe Thunderstorm with Heavy Hail', icon: 'cloud-lightning' };
      default: return { condition: 'Partly Cloudy', icon: 'cloud-sun' };
    }
  }

  /**
   * Fetch live weather and forecast from Open-Meteo API
   */
  static async fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Weather API returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      const currentRaw = data.current;
      const hourlyRaw = data.hourly;
      const dailyRaw = data.daily;

      const currentWMO = this.decodeWMOCode(currentRaw.weather_code || 0);

      // Format sunrise/sunset
      const todaySunrise = dailyRaw.sunrise?.[0] ? new Date(dailyRaw.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '05:58 AM';
      const todaySunset = dailyRaw.sunset?.[0] ? new Date(dailyRaw.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:22 PM';

      const current: CurrentWeather = {
        temperature: Math.round(currentRaw.temperature_2m),
        feelsLike: Math.round(currentRaw.apparent_temperature ?? currentRaw.temperature_2m),
        condition: currentWMO.condition,
        conditionCode: currentRaw.weather_code || 0,
        humidity: currentRaw.relative_humidity_2m ?? 70,
        windSpeed: Math.round(currentRaw.wind_speed_10m ?? 14),
        windDirection: currentRaw.wind_direction_10m ?? 180,
        windGust: currentRaw.wind_gusts_10m ? Math.round(currentRaw.wind_gusts_10m) : undefined,
        pressure: Math.round(currentRaw.pressure_msl ?? 1012),
        uvIndex: currentRaw.uv_index ?? 5,
        visibility: 10,
        cloudCover: currentRaw.cloud_cover ?? 45,
        rainProbability: hourlyRaw.precipitation_probability?.[0] ?? 20,
        precipitation: currentRaw.precipitation ?? 0,
        sunrise: todaySunrise,
        sunset: todaySunset,
        isDay: currentRaw.is_day === 1,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataSource: 'Open-Meteo Meteorological Service'
      };

      // Extract next 24 hours
      const nowIndex = new Date().getHours();
      const hourly: HourlyForecast[] = [];
      const totalHours = Math.min(24, hourlyRaw.time.length - nowIndex);

      for (let i = 0; i < totalHours; i++) {
        const idx = nowIndex + i;
        const timeStr = hourlyRaw.time[idx];
        const dateObj = new Date(timeStr);
        const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });
        const wmo = this.decodeWMOCode(hourlyRaw.weather_code[idx] || 0);

        hourly.push({
          time: timeStr,
          hourStr: i === 0 ? 'Now' : hourLabel,
          temperature: Math.round(hourlyRaw.temperature_2m[idx]),
          condition: wmo.condition,
          conditionCode: hourlyRaw.weather_code[idx] || 0,
          rainProbability: hourlyRaw.precipitation_probability[idx] ?? 10,
          windSpeed: Math.round(hourlyRaw.wind_speed_10m[idx] ?? 12),
          humidity: hourlyRaw.relative_humidity_2m[idx] ?? 65,
          isDay: hourlyRaw.is_day[idx] === 1,
          uvIndex: hourlyRaw.uv_index[idx] ?? 2
        });
      }

      // Format 7 days
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysOfWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daily: DailyForecast[] = [];

      for (let i = 0; i < dailyRaw.time.length; i++) {
        const dateObj = new Date(dailyRaw.time[i]);
        const dayIdx = dateObj.getDay();
        const wmo = this.decodeWMOCode(dailyRaw.weather_code[i] || 0);
        const maxT = Math.round(dailyRaw.temperature_2m_max[i]);
        const minT = Math.round(dailyRaw.temperature_2m_min[i]);
        const rainP = dailyRaw.precipitation_probability_max[i] ?? 30;

        let riskLevel: 'low' | 'moderate' | 'high' | 'extreme' = 'low';
        let riskScore = 20;
        if (rainP > 75 || maxT > 41) {
          riskLevel = 'high';
          riskScore = 72;
        } else if (rainP > 50 || maxT > 37) {
          riskLevel = 'moderate';
          riskScore = 48;
        }

        daily.push({
          date: dailyRaw.time[i],
          dayName: i === 0 ? 'Today' : daysOfWeekFull[dayIdx],
          dayNameShort: i === 0 ? 'Today' : daysOfWeek[dayIdx],
          maxTemp: maxT,
          minTemp: minT,
          condition: wmo.condition,
          conditionCode: dailyRaw.weather_code[i] || 0,
          rainProbability: rainP,
          precipitationSum: dailyRaw.precipitation_sum[i] ?? 0,
          windSpeed: Math.round(dailyRaw.wind_speed_10m_max[i] ?? 15),
          humidity: 72,
          uvMax: dailyRaw.uv_index_max[i] ?? 6,
          sunrise: new Date(dailyRaw.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(dailyRaw.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          riskLevel,
          riskScore
        });
      }

      return {
        current,
        hourly,
        daily,
        isSimulated: false
      };
    } catch (err) {
      console.warn('Live weather fetch failed, using realistic fallback telemetry:', err);
      return this.generateFallbackWeather(lat, lon);
    }
  }

  /**
   * High-fidelity offline fallback generator matching geographical latitude
   */
  static generateFallbackWeather(lat: number, _lon: number): WeatherResponse {
    // Generate realistic tropical Indian weather based on time of day
    const now = new Date();
    const isDay = now.getHours() >= 6 && now.getHours() <= 18;
    const baseTemp = lat > 20 ? 32 : 30; // Northern plains vs Coastal south

    const current: CurrentWeather = {
      temperature: isDay ? baseTemp : baseTemp - 5,
      feelsLike: isDay ? baseTemp + 3 : baseTemp - 3,
      condition: 'Partly Cloudy',
      conditionCode: 2,
      humidity: 74,
      windSpeed: 18,
      windDirection: 140,
      windGust: 28,
      pressure: 1011,
      uvIndex: isDay ? 7 : 0,
      visibility: 8.5,
      cloudCover: 55,
      rainProbability: 45,
      precipitation: 0.8,
      sunrise: '05:58 AM',
      sunset: '06:24 PM',
      isDay,
      lastUpdated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dataSource: 'Simulated Indian Meteorological Model (Offline Cache)'
    };

    const hourly: HourlyForecast[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = (now.getHours() + i) % 24;
      const hIsDay = hour >= 6 && hour <= 18;
      const hTemp = hIsDay ? baseTemp - 2 + (hour % 5) : baseTemp - 6 + (hour % 3);
      const hRain = (30 + (i * 7)) % 85;

      hourly.push({
        time: `${hour}:00`,
        hourStr: i === 0 ? 'Now' : `${hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)} ${hour >= 12 ? 'PM' : 'AM'}`,
        temperature: hTemp,
        condition: hRain > 60 ? 'Light Showers' : 'Partly Cloudy',
        conditionCode: hRain > 60 ? 61 : 2,
        rainProbability: hRain,
        windSpeed: 14 + (i % 6),
        humidity: 70 + (i % 15),
        isDay: hIsDay,
        uvIndex: hIsDay ? 5 : 0
      });
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daily: DailyForecast[] = [];
    for (let d = 0; d < 7; d++) {
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + d);
      const dayName = d === 0 ? 'Today' : dayNames[futureDate.getDay()];
      const rainP = [45, 65, 78, 30, 20, 25, 40][d];

      daily.push({
        date: futureDate.toISOString().split('T')[0],
        dayName: d === 0 ? 'Today' : futureDate.toLocaleDateString([], { weekday: 'long' }),
        dayNameShort: dayName,
        maxTemp: baseTemp + (d % 3),
        minTemp: baseTemp - 6 + (d % 2),
        condition: rainP > 70 ? 'Heavy Rain' : (rainP > 40 ? 'Scattered Showers' : 'Partly Cloudy'),
        conditionCode: rainP > 70 ? 65 : (rainP > 40 ? 61 : 2),
        rainProbability: rainP,
        precipitationSum: rainP > 50 ? 12.4 : 1.2,
        windSpeed: 16 + (d * 2),
        humidity: 72,
        uvMax: 7,
        sunrise: '05:58 AM',
        sunset: '06:24 PM',
        riskLevel: rainP > 70 ? 'high' : (rainP > 50 ? 'moderate' : 'low'),
        riskScore: rainP > 70 ? 74 : (rainP > 50 ? 52 : 25)
      });
    }

    return {
      current,
      hourly,
      daily,
      isSimulated: true
    };
  }
}
