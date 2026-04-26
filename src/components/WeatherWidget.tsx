import { Sun, Cloud, CloudRain, Snowflake, Thermometer, Wind, LucideIcon } from 'lucide-react';

interface WeatherInfo {
  text: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
}

interface WeatherData {
  current?: {
    temperature_2m: number;
    weather_code: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

function getWeatherInfo(wmoCode: number): WeatherInfo {
  if (wmoCode === 0) return { text: 'Sonnig', Icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
  if (wmoCode > 0 && wmoCode <= 3) return { text: 'Bewölkt', Icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-200 dark:bg-gray-800' };
  if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return { text: 'Regen', Icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
  if (wmoCode >= 71 && wmoCode <= 77) return { text: 'Schnee', Icon: Snowflake, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' };
  return { text: 'Wechselhaft', Icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-200 dark:bg-gray-800' };
}

export default async function WeatherWidget() {
  let weatherData: WeatherData | null = null;
  
  try {
    // latitude=49.41 & longitude=11.10 -> Exakte Koordinaten für die Kettlersiedlung (Nürnberg Süd)
    // timezone=Europe/Berlin -> Sagt der API nur, dass wir die deutsche Uhrzeit nutzen.
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=49.41&longitude=11.10&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1',
      { next: { revalidate: 1800 } } 
    );
    weatherData = await res.json();
  } catch (error) {
    console.error("Wetter konnte nicht geladen werden", error);
  }

  const currentTemp = weatherData?.current?.temperature_2m ? Math.round(weatherData.current.temperature_2m) : 22;
  const minTemp = weatherData?.daily?.temperature_2m_min?.[0] ? Math.round(weatherData.daily.temperature_2m_min[0]) : 12;
  const maxTemp = weatherData?.daily?.temperature_2m_max?.[0] ? Math.round(weatherData.daily.temperature_2m_max[0]) : 24;
  
  const weatherCode = weatherData?.current?.weather_code ?? 0;
  const { text: weatherText, Icon: WeatherIcon, color: iconColor, bg: iconBg } = getWeatherInfo(weatherCode);

  return (
    <div className="absolute -top-6 -left-2 sm:-left-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-blue-50 dark:border-slate-700 transition-transform duration-500 ease-out [transform:translateZ(30px)] group-hover:[transform:translateZ(60px)_translateY(-8px)] z-20 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className={`${iconBg} ${iconColor} p-2 rounded-full`}>
          <WeatherIcon className={`w-5 h-5 ${weatherCode === 0 ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            {currentTemp}°C <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{weatherText}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <Thermometer className="w-3 h-3" /> Min {minTemp}° / Max {maxTemp}°
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2 py-1 flex items-center gap-1.5 border border-green-100 dark:border-green-800/30 mt-1">
        <Wind className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        <span className="text-[10px] md:text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
          Luft ideal für Sport
        </span>
      </div>
    </div>
  );
}