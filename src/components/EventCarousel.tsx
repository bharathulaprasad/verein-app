'use client';

import { useState, useEffect, useRef } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import EventRsvpButton from './EventRsvpButton';

interface EventCarouselProps {
  events: any[]; 
  userId: string | undefined;
  userRole?: string;
  isLoggedIn: boolean;
  isAdminOrVorstand: boolean;
}

export default function EventCarousel({ events, userId, userRole, isLoggedIn, isAdminOrVorstand }: EventCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          const itemWidth = container.scrollWidth / events.length;
          const nextIndex = (activeIndex + 1) % events.length;
          container.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
          setActiveIndex(nextIndex);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, events.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / events.length;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.scrollWidth / events.length;
      scrollContainerRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
        Derzeit keine weiteren Sonderveranstaltungen geplant.
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => {
          const isParticipating = userId 
            ? event.attendees.some((attendee: any) => attendee.userId === userId) 
            : false;

          return (
            <div 
              key={event.id} 
              // ✨ Anpassung: p-4 (statt p-6) und rounded-xl für kompakten Look
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-start bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* ✨ Anpassung: text-lg statt text-xl, tighter leading */}
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 line-clamp-2 leading-tight">
                  {event.title}
                </h3>
                
                {/* ✨ Anpassung: mt-1.5, text-sm, line-clamp-2 (weniger Text sichtbar) */}
                <p className="text-gray-600 dark:text-gray-400 mt-1.5 text-sm line-clamp-2">
                  {event.description}
                </p>
                
                {/* ✨ Anpassung: Kompakte Info-Box mit leichtem Hintergrund */}
                <div className="mt-3 space-y-1.5 text-[13px] sm:text-sm text-gray-700 dark:text-gray-300 bg-blue-50/50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-blue-100/50 dark:border-slate-700/50">
                  <p className="flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-2 text-blue-500 dark:text-blue-400 shrink-0" />
                    {/* ✨ Anpassung: Kompaktes Datum (2-digit statt long) */}
                    {new Date(event.date).toLocaleDateString("de-DE", { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' })} Uhr
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-blue-500 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </p>
                </div>
              </div>

              {/* ✨ Anpassung: Weniger Margin nach oben (mt-4 statt mt-6) */}
              <div className="mt-4">
                <EventRsvpButton 
                  eventId={event.id}
                  initialIsParticipating={isParticipating}
                  participantCount={event.attendees.length}
                  isLoggedIn={isLoggedIn}
                  userRole={userRole}
                />
                
                {isAdminOrVorstand && event.attendees.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                    <details className="group/details">
                      <summary className="cursor-pointer text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 flex items-center outline-none">
                        <span className="mr-1.5">📋</span>
                        Teilnehmer ({event.attendees.length})
                        <span className="ml-auto transition-transform group-open/details:rotate-180">▼</span>
                      </summary>
                      <ul className="mt-2 space-y-1.5 text-xs text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 max-h-32 overflow-y-auto">
                        {event.attendees.map((attendee: any) => (
                          <li key={attendee.id} className="flex items-center">
                            <span className="w-1 h-1 bg-amber-500 rounded-full mr-2 shrink-0"></span>
                            <span className="truncate">{attendee.user?.name || attendee.user?.email || "Unbekanntes Mitglied"}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-1">
          {events.map((_, index) => {
            // Optional: Letzte Punkte auf dem PC ausblenden, da immer 3 Karten sichtbar sind
            if (index > events.length - 3 && window?.innerWidth >= 1024) return null;
            if (index > events.length - 2 && window?.innerWidth >= 640 && window?.innerWidth < 1024) return null;

            return (
              <button
                key={index}
                onClick={() => scrollToDot(index)}
                aria-label={`Gehe zu Event ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-blue-600 dark:bg-blue-400 w-6' 
                    : 'bg-gray-300 dark:bg-slate-700 w-2 hover:bg-blue-400 dark:hover:bg-blue-500'
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  );
}