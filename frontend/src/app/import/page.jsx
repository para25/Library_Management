'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

export default function ImportBooksPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isbn: '',
    publisher: '',
    pages: 20
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setResult(null);
      
      const response = await api.post('/import', formData);
      
      setResult({
        success: true,
        message: response.data.message,
        count: response.data.books?.length || 0
      });
      
      // Reset form
      setFormData({
        title: '',
        authors: '',
        isbn: '',
        publisher: '',
        pages: 20
      });
      
    } catch (err) {
      console.error('Import error:', err);
      setResult({
        success: false,
        message: err.response?.data?.message || 'Failed to import books'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Import Books from Frappe</h1>
        <p className="text-white">
          Import books from the Frappe Library API. Fill in any combination of filters below.
          Leave fields empty to import without filtering. Only &quot;Number of Books&quot; is required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Search by book title"
            className="w-full border text-black border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Authors (Optional)</label>
          <input
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            placeholder="Search by author name"
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">ISBN (Optional)</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Search by ISBN"
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Publisher (Optional)</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Search by publisher"
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Number of Books to Import <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            min="1"
            max="100"
            required
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Maximum 100 books per import</p>
        </div>

        {result && (
          <div className={`p-4 rounded ${result.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <p className="font-medium">{result.message}</p>
            {result.success && result.count > 0 && (
              <p className="text-sm mt-1">Successfully imported {result.count} new books to your library!</p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Importing...' : 'Import Books'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            Back to Home
          </button>
        </div>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>The Frappe API returns 20 books per page</li>
          <li>Duplicate books (same bookID) are automatically skipped</li>
          <li>All imported books get default stock of 1 and rent of ₹10/day</li>
          <li>Use filters to narrow down your search results</li>
        </ul>
      </div>
    </div>
  );
}
