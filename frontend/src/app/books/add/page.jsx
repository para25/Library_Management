'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

function AddEditBookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (bookId) {
      setIsEdit(true);
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${bookId}`);
      const book = res.data.book;

      // Pre-fill the form with existing data
      setValue('title', book.title);
      setValue('authors', book.authors);
      setValue('publisher', book.publisher || '');
      setValue('isbn', book.isbn || '');
      setValue('isbn13', book.isbn13 || '');
      setValue('numPages', book.numPages || '');
      setValue('stock', book.stock);
      setValue('rentPerDay', book.rentPerDay);
    } catch (error) {
      console.error('Error fetching book:', error);
      alert('Failed to load book data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isEdit) {
        // Update existing book
        await api.put(`/books/${bookId}`, data);
        alert('Book updated successfully!');
      } else {
        // Create new book
        await api.post('/books', data);
        alert('Book added successfully!');
      }

      router.push('/books');
    } catch (error) {
      console.error('Error saving book:', error);
      alert(error.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </h1>

      {loading && !isEdit ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 text-black">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Authors */}
          <div>
            <label className="block font-semibold mb-1 text-black">
              Authors <span className="text-red-600">*</span>
            </label>
            <input
              {...register('authors', { required: 'Authors are required' })}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
            {errors.authors && (
              <p className="text-red-600 text-sm">{errors.authors.message}</p>
            )}
          </div>

          {/* Publisher */}
          <div>
            <label className="block font-semibold mb-1 text-black">Publisher</label>
            <input
              {...register('publisher')}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block font-semibold mb-1 text-black">ISBN</label>
            <input
              {...register('isbn')}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
          </div>

          {/* ISBN13 */}
          <div>
            <label className="block font-semibold mb-1 text-black">ISBN13</label>
            <input
              {...register('isbn13')}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
          </div>

          {/* Number of Pages */}
          <div>
            <label className="block font-semibold mb-1 text-black">Number of Pages</label>
            <input
              type="number"
              {...register('numPages', { min: 0 })}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
            {errors.numPages && (
              <p className="text-red-600 text-sm">Must be 0 or greater</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block font-semibold mb-1 text-black">
              Stock <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              {...register('stock', { required: 'Stock is required', min: 0 })}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
            {errors.stock && (
              <p className="text-red-600 text-sm">{errors.stock.message}</p>
            )}
          </div>

          {/* Rent per Day */}
          <div>
            <label className="block font-semibold mb-1 text-black">
              Rent per Day (₹) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              {...register('rentPerDay', { required: 'Rent per day is required', min: 0 })}
              className="w-full border px-3 py-2 rounded text-gray-900"
            />
            {errors.rentPerDay && (
              <p className="text-red-600 text-sm">{errors.rentPerDay.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/books')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AddEditBook() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AddEditBookForm />
    </Suspense>
  );
}
