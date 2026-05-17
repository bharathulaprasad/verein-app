"use client";

import { useState, useEffect } from 'react';

interface Quote {
    id: number;
    quote: string;
    author: string;
    // The remote JSON has other fields, but we only need these.
}

export default function RandomQuote() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch quotes from the external URL when the component mounts
        fetch('https://raw.githubusercontent.com/andtechub/zitate-liste/main/quote.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // The quotes are in a "quotes" array in the fetched JSON
                if (data && Array.isArray(data.quotes)) {
                    setQuotes(data.quotes);
                }
            })
            .catch(err => {
                console.error("Failed to fetch quotes:", err);
                setError("Zitate konnten nicht geladen werden.");
            });
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        if (quotes.length === 0) return;

        const getRandomQuote = () => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            return quotes[randomIndex];
        };

        // Set an initial quote and then update it on an interval
        setCurrentQuote(getRandomQuote()); // Set initial quote
        const intervalId = setInterval(() => setCurrentQuote(getRandomQuote()), 5000); // Refresh every 20 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [quotes]);

    if (error) {
        return <div className="text-center p-4 text-sm text-red-500">{error}</div>;
    }

    if (!currentQuote) {
        return <div className="text-center p-4 text-sm text-slate-500 dark:text-slate-400">Lade ein zufälliges Zitat...</div>;
    }

    return (
        <div className="text-center p-4 text-sm text-slate-500 dark:text-slate-400">
            <blockquote className="italic">"{currentQuote.quote}"</blockquote>
            <cite className="block text-right mt-1 not-italic">&mdash; {currentQuote.author}</cite>
        </div>
    );
}