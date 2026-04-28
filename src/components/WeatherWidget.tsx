import { Sun, Cloud, CloudRain, Snowflake, Wind, LucideIcon } from 'lucide-react';

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
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

function getWeatherInfo(wmoCode: number): WeatherInfo {
  if (wmoCode === 0) return { text: 'Sonnig', Icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
  if (wmoCode > 0 && wmoCode <= 3) return { text: 'Bewölkt', Icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-200 dark:bg-gray-800' };
  if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return { text: 'Regen', Icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
  if (wmoCode >= 71 && wmoCode <= 77) return { text: 'Schnee', Icon: Snowflake, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' };
  return { text: 'Mix', Icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-200 dark:bg-gray-800' };
}

export default async function WeatherWidget() {
  let weatherData: WeatherData | null = null;
  
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=49.41&longitude=11.10&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=7',
      { next: { revalidate: 1800 } } 
    );
    weatherData = await res.json();
  } catch (error) {
    console.error("Wetter konnte nicht geladen werden", error);
  }

  // Current Weather
  const currentTemp = weatherData?.current?.temperature_2m ? Math.round(weatherData.current.temperature_2m) : 22;
  const weatherCode = weatherData?.current?.weather_code ?? 0;
  const { text: weatherText, Icon: WeatherIcon, color: iconColor, bg: iconBg } = getWeatherInfo(weatherCode);

  const isIdealForSport = weatherCode <= 3 && currentTemp >= 10 && currentTemp <= 25;

  // Format the 7-day forecast array
  const forecastDays = weatherData?.daily?.time?.map((dateStr, index) => {
    const dateObj = new Date(dateStr);
    let label = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(dateObj);
    if (index === 0) label = 'Heute';
    if (index === 1) label = 'Morgen';

    const code = weatherData?.daily?.weather_code?.[index] ?? 0;
    const min = weatherData?.daily?.temperature_2m_min?.[index] !== undefined ? Math.round(weatherData.daily.temperature_2m_min[index]) : '-';
    const max = weatherData?.daily?.temperature_2m_max?.[index] !== undefined ? Math.round(weatherData.daily.temperature_2m_max[index]) : '-';
    const { Icon: DailyIcon, color: dColor } = getWeatherInfo(code);

    return { label, min, max, DailyIcon, dColor };
  }) || [];

  // We duplicate the array to create a seamless infinite scrolling effect
  const scrollingMarquee = [...forecastDays, ...forecastDays];

  return (
    <>
      {/* CSS For the seamless auto-scroll marquee */}
      <style>{`
        @keyframes weather-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-weather-scroll {
          display: flex;
          width: max-content;
          animation: weather-scroll 20s linear infinite;
        }
        .animate-weather-scroll:hover {
          animation-play-state: paused;
        }
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>

      <div className="absolute -top-4 -left-2 sm:-left-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-transform duration-500 ease-out z-20 flex flex-col gap-2 min-w-[200px] max-w-[220px]">
        
        {/* 1. COMPACT CURRENT WEATHER */}
        <div className="flex items-center gap-2.5 px-1">
          <div className={`${iconBg} ${iconColor} p-1.5 rounded-full shrink-0`}>
            <WeatherIcon className={`w-5 h-5 ${weatherCode === 0 ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{currentTemp}°C</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{weatherText}</span>
            </div>
            
            {/* Tiny Sport Badge Inline */}
            <div className="flex items-center gap-1 mt-1">
              <Wind className={`w-3 h-3 ${isIdealForSport ? 'text-green-500' : 'text-orange-400'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isIdealForSport ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                {isIdealForSport ? "Sport Ideal" : "Sport Naja"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. AUTO-SCROLLING FORECAST TICKER */}
        <div className="w-full overflow-hidden fade-edges border-t border-slate-100 dark:border-slate-700/50 pt-2">
          <div className="animate-weather-scroll gap-4">
            {scrollingMarquee.map((day, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium shrink-0">
                <span className="text-slate-600 dark:text-slate-300">{day.label}</span>
                <day.DailyIcon className={`w-3.5 h-3.5 ${day.dColor}`} />
                <span className="text-slate-500 dark:text-slate-400">
                  {day.min}° / {day.max}°
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}