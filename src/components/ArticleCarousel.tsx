'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Typ-Definition passend zu deinen Artikeln aus Prisma
interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date | string;
  authorName: string;
}

interface ArticleCarouselProps {
  articles: Article[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-Scroll alle 5 Sekunden
  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          const itemWidth = container.scrollWidth / articles.length;
          const nextIndex = (activeIndex + 1) % articles.length;
          container.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
          setActiveIndex(nextIndex);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, articles.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / articles.length;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.scrollWidth / articles.length;
      scrollContainerRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center space-x-3 mb-8">
        <span className="text-blue-600 dark:text-blue-400 text-3xl">📰</span>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Neuigkeiten & Berichte</h2>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
          Noch keine Artikel veröffentlicht.
        </div>
      ) : (
        <div className="relative w-full group">
          {/* Scroll-Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            // gap-6 = 24px Abstand zwischen den Karten
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {articles.map((article) => (
              <Link 
                href={`/blog/${article.id}`} 
                key={article.id} 
                // w-full = 1 Item (Mobile), sm:w-[calc(50%-12px)] = EXAKT 2 Items ab Tablet/Desktop
                className="w-full sm:w-[calc(50%-12px)] flex-none snap-start group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-auto min-h-[350px]"
              >
                {article.imageUrl && (
                  <div className="w-full h-48 bg-gray-200 dark:bg-slate-800 overflow-hidden shrink-0">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                    {new Date(article.createdAt).toLocaleDateString("de-DE")}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {article.content}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-500 font-medium flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                    Von {article.authorName}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigations-Punkte (Dots) */}
          {articles.length > 2 && (
            <div className="flex justify-center gap-2 mt-2">
              {articles.map((_, index) => {
                // Da 2 Artikel auf dem Desktop sichtbar sind, machen die letzten Punkte keinen Sinn
                if (index > articles.length - 2 && window?.innerWidth >= 640) return null;
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToDot(index)}
                    aria-label={`Gehe zu Artikel ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-blue-600 dark:bg-blue-400 w-8' 
                        : 'bg-gray-300 dark:bg-slate-700 w-2.5 hover:bg-blue-400 dark:hover:bg-blue-500'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}