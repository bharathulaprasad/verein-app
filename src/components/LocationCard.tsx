import { MapPin, BusFront } from 'lucide-react';
import VAGLiveDepartureWidget from './VAGLiveDepartureWidget'; // Import the new VAG Live Departure Widget
import WeatherWidget from './WeatherWidget'; 

export default function LocationCard() {
  return (
    <div className="relative w-full max-w-sm lg:max-w-[400px] group [perspective:1000px] z-10">
      
      <div className="relative bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)_scale(1.02)]">
        
        {/* Schwebendes Wetter-Widget */}
        <WeatherWidget />

        <div className="relative w-full h-56 sm:h-64 lg:h-[300px] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 shadow-inner">
          <iframe 
            src="https://maps.google.com/maps?q=Siedlerfestplatz,nuremberg&t=k&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 pointer-events-auto"
          />
        </div>
        
        <div className="p-3 flex items-center justify-center lg:justify-start">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 animate-bounce" />
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
           Siedlerfestplatz, 90469 Nürnberg
          </p>
        </div>

        {/* Collapsible VAG Live Departure Widget */}
        <div className="px-3 pb-3">
          <details className="group/details">
            <summary className="list-none flex items-center justify-between cursor-pointer bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-baseline gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <BusFront className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Live-Abfahrten
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(ausklappen)</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 transition-transform duration-300 group-open/details:rotate-180">▼</span>
            </summary>
            <div className="mt-2"><VAGLiveDepartureWidget /></div>
          </details>
        </div>

        <div className="absolute -bottom-3 -right-3 bg-blue-600 dark:bg-blue-500 text-white py-1.5 px-4 rounded-xl shadow-lg font-bold text-sm md:text-base border-2 border-white dark:border-slate-800 transition-transform duration-500 ease-out [transform:translateZ(20px)] group-hover:[transform:translateZ(40px)_translateY(-5px)]">
          90469
        </div>

      </div>
      
      <div className="absolute -bottom-8 left-10 right-10 h-8 bg-black/10 dark:bg-black/30 blur-xl rounded-full transition-all duration-500 group-hover:opacity-70 group-hover:scale-90 -z-10"></div>
    </div>
  );
}