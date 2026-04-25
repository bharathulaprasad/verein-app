'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react'; // ✨ Added Trash2 icon

export default function EditArticleForm({ article }: { article: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // ✨ Track deleting state
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: article.title,
    content: article.content,
    imageUrl: article.imageUrl || '',
    isPublished: article.isPublished
  });

  // ✨ NEW: Function to handle deleting
  const handleDelete = async () => {
    // Show a browser confirmation popup
    const confirmed = window.confirm("Bist du sicher, dass du diesen Artikel unwiderruflich löschen möchtest?");
    if (!confirmed) return;

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'DELETE', // ✨ Uses our new DELETE endpoint
      });

      const data = await res.json();

      if (data.success) {
        router.push('/'); // Send them back to home page after deleting
        router.refresh();
      } else {
        setError(data.error || 'Fehler beim Löschen.');
        setIsDeleting(false);
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/blog/${article.id}`); 
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
    <main className="max-w-4xl mx-auto p-6 md:p-8 min-h-screen pt-12">
      <div className="mb-8">
        <Link href={`/blog/${article.id}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Zurück zum Artikel
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">
          Artikel bearbeiten
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
        
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Titel des Artikels *
          </label>
          <input
            type="text"
            id="title"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <ImageIcon className="w-4 h-4 mr-1.5 text-gray-500" />
            Titelbild URL (Optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Artikelinhalt *
          </label>
          <textarea
            id="content"
            required
            rows={12}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700 gap-6">
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.isPublished ? 'Veröffentlicht' : 'Als Entwurf markieren'}
            </span>
          </label>

          {/* ✨ BUTTON GROUP (Delete & Save) */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button
              type="button" // Important: type="button" so it doesn't trigger the form Submit!
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 font-bold rounded-lg transition disabled:opacity-50"
            >
              {isDeleting ? "Wird gelöscht..." : <><Trash2 className="w-5 h-5 mr-2" /> Artikel löschen</>}
            </button>

            <button
              type="submit"
              disabled={isLoading || isDeleting}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50"
            >
              {isLoading ? "Speichern..." : <><Save className="w-5 h-5 mr-2" /> Änderungen speichern</>}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}