import { MapPin } from 'lucide-react';
import WeatherWidget from './WeatherWidget'; 

export default function LocationCard() {
  return (
    <div className="relative w-full max-w-sm lg:max-w-[400px] group [perspective:1000px] z-10">
      
      <div className="relative bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-12deg)_scale(1.02)]">
        
        {/* Schwebendes Wetter-Widget */}
        <WeatherWidget />

        <div className="relative w-full h-56 sm:h-64 lg:h-[300px] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 shadow-inner">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1297.877960309995!2d11.10366638886994!3d49.406493500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f59febd61a5df%3A0x88318a041a9eb382!2sSiedlerfestplatz!5e0!3m2!1sen!2sde!4v1722332898858!5m2!1sen!2sde"
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
            Heimat: 90469, Nürnberg
          </p>
        </div>

        <div className="absolute -bottom-3 -right-3 bg-blue-600 dark:bg-blue-500 text-white py-1.5 px-4 rounded-xl shadow-lg font-bold text-sm md:text-base border-2 border-white dark:border-slate-800 transition-transform duration-500 ease-out [transform:translateZ(20px)] group-hover:[transform:translateZ(40px)_translateY(-5px)]">
          90469
        </div>

      </div>
      
      <div className="absolute -bottom-8 left-10 right-10 h-8 bg-black/10 dark:bg-black/30 blur-xl rounded-full transition-all duration-500 group-hover:opacity-70 group-hover:scale-90 -z-10"></div>
    </div>
  );
}