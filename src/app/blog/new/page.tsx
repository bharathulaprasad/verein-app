'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Send, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isPublished: true // Default to published
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        // Redirect back to home page (or blog page) after success
        router.push('/'); 
        router.refresh();
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-8 min-h-screen">
      
      <div className="mb-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">
          Neuen Artikel verfassen
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Teilen Sie Neuigkeiten, Veranstaltungsberichte oder wichtige Updates mit dem Verein.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
        
        {/* TITEL */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Titel des Artikels *
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="z.B. Rückblick auf das Sommerfest 2024"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* BILD URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <ImageIcon className="w-4 h-4 mr-1.5 text-gray-500" />
            Titelbild URL (Optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            placeholder="https://beispiel.de/bild.jpg"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1.5">Fügen Sie einen Link zu einem Bild ein, um den Artikel ansprechender zu machen.</p>
        </div>

        {/* INHALT (TEXTAREA) */}
        <div>
          <label htmlFor="content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Artikelinhalt *
          </label>
          <textarea
            id="content"
            required
            rows={12}
            placeholder="Schreiben Sie hier Ihren Text..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-y"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        {/* STATUS TOGGLE & BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700 gap-4">
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.isPublished ? 'Sofort veröffentlichen' : 'Als Entwurf speichern'}
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              "Wird gespeichert..."
            ) : formData.isPublished ? (
              <><Send className="w-5 h-5 mr-2" /> Veröffentlichen</>
            ) : (
              <><Save className="w-5 h-5 mr-2" /> Entwurf speichern</>
            )}
          </button>
        </div>

      </form>
    </main>
  );
}