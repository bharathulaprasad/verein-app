'use client'; // WICHTIG: Da wir Hooks (useState, useEffect) für den Slider nutzen

import { useState, useEffect, useRef } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import EventRsvpButton from './EventRsvpButton'; 

// Typen für die Props
interface EventCarouselProps {
  events: any[]; // Hier kannst du deinen genauen Prisma-Typ einsetzen
  userId: string | undefined;
  isLoggedIn: boolean;
  isAdminOrVorstand: boolean;
}

export default function EventCarousel({ events, userId, isLoggedIn, isAdminOrVorstand }: EventCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatisches Scrollen (alle 5 Sekunden)
  useEffect(() => {
    if (events.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Wenn wir am Ende angekommen sind, springe zurück zum Anfang
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          // Ansonsten scrolle ein Element weiter
          const itemWidth = container.scrollWidth / events.length;
          const nextIndex = (activeIndex + 1) % events.length;
          container.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
          setActiveIndex(nextIndex);
        }
      }
    }, 5000); // 5000ms = 5 Sekunden

    return () => clearInterval(interval);
  }, [activeIndex, events.length]);

  // Aktualisiert den aktiven Punkt, wenn der Nutzer per Hand scrollt/wischt
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / events.length;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  // Klick auf einen Punkt
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
      
      {/* Scroll-Container: Versteckt den Scrollbalken, aktiviert Snap-Scrolling */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => {
          
          // Check ob der Nutzer teilnimmt
          const isParticipating = userId 
            ? event.attendees.some((attendee: any) => attendee.userId === userId) 
            : false;

          return (
            <div 
              key={event.id} 
              // Responsive Breite: 1 auf Handy (100%), 2 auf Tablet (50%), 3 auf Desktop (33.3%)
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-start bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400 line-clamp-2">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-3">{event.description}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 shrink-0" />
                    {new Date(event.date).toLocaleDateString("de-DE", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })} Uhr
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <EventRsvpButton 
                  eventId={event.id}
                  initialIsParticipating={isParticipating}
                  participantCount={event.attendees.length}
                  isLoggedIn={isLoggedIn}
                />
                
                {/* Teilnehmerliste für Admin/Vorstand */}
                {isAdminOrVorstand && event.attendees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                    <details className="group/details">
                      <summary className="cursor-pointer text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 flex items-center outline-none">
                        <span className="mr-2">📋</span>
                        Teilnehmerliste ({event.attendees.length})
                        <span className="ml-auto transition-transform group-open/details:rotate-180">▼</span>
                      </summary>
                      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 max-h-32 overflow-y-auto">
                        {event.attendees.map((attendee: any) => (
                          <li key={attendee.id} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 shrink-0"></span>
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

      {/* Navigations-Punkte (Dots) unten */}
      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToDot(index)}
              aria-label={`Gehe zu Event ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-blue-600 dark:bg-blue-400 w-8' // Aktiver Punkt ist ein breiteres "Pill"
                  : 'bg-gray-300 dark:bg-slate-700 w-2.5 hover:bg-blue-400 dark:hover:bg-blue-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}