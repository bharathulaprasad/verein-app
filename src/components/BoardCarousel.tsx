'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

// Typ-Definition passend zu deiner Datenbank
interface BoardMember {
  id: string | number;
  role: string;
  name: string;
  phone: string;
  address: string;
  email: string;
}

interface BoardCarouselProps {
  members: BoardMember[];
}

export default function BoardCarousel({ members }: BoardCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-Scroll alle 5 Sekunden
  useEffect(() => {
    if (members.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Wenn am Ende angekommen, zurück zum Start
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          // Ansonsten 1 Element weiter scrollen
          const itemWidth = container.scrollWidth / members.length;
          const nextIndex = (activeIndex + 1) % members.length;
          container.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
          setActiveIndex(nextIndex);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, members.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / members.length;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.scrollWidth / members.length;
      scrollContainerRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  if (!members || members.length === 0) return null;

  return (
    <div className="space-y-6 w-full">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ihre Ansprechpartner</h3>
      
      <div className="relative group">
        {/* Scroll-Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {members.map((member) => (
            <div 
              key={member.id} 
              // w-full = 1 Item auf Mobile, sm:w-[calc(50%-8px)] = 2 Items nebeneinander ab Tablet
              className="w-full sm:w-[calc(50%-8px)] flex-none snap-start bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors"
            >
              <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm uppercase tracking-wider">{member.role}</h4>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{member.name}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" /> 
                  {member.phone}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" /> 
                  <span className="truncate">{member.address}</span>
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" /> 
                  <a href={`mailto:${member.email}`} className="hover:text-blue-500 truncate">{member.email}</a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigations-Punkte unten */}
        {members.length > 2 && ( // Zeige Punkte nur, wenn es mehr als 2 Mitglieder gibt (da 2 ja schon auf den Desktop passen)
          <div className="flex justify-center gap-2 mt-2">
            {members.map((_, index) => {
              // Verstecke die letzten Punkte, wenn sie keinen Sinn mehr machen (da 2 Items sichtbar sind)
              if (index > members.length - 2 && window?.innerWidth >= 640) return null;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToDot(index)}
                  aria-label={`Gehe zu Ansprechpartner ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-blue-600 dark:bg-blue-400 w-8' 
                      : 'bg-gray-300 dark:bg-slate-700 w-2.5 hover:bg-blue-400 dark:hover:bg-blue-500'
                  }`}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}