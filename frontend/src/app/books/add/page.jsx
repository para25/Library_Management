'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddEditBook() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id'); // if editing, id will be present

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (bookId) {
      setIsEdit(true);
      fetchBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${bookId}`);
      const book = res.data.book;
      // populate form
      setValue('title', book.title);
      setValue('authors', book.authors);
      setValue('publisher', book.publisher || '');
      setValue('isbn', book.isbn || '');
      setValue('isbn13', book.isbn13 || '');
      setValue('numPages', book.numPages || 0);
      setValue('stock', book.stock || 1);
      setValue('rentPerDay', book.rentPerDay || 10);
    } catch (err) {
      console.error('Fetch book error', err);
      alert('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/books/${bookId}`, data);
        alert('Book updated successfully!');
      } else {
        await api.post('/books', data);
        alert('Book added successfully!');
      }
      router.push('/books');
    } catch (err) {
      console.error('Submit error', err);
      alert('Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Authors</label>
            <input
              type="text"
              {...register('authors', { required: 'Authors are required' })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.authors && <p className="text-red-600 text-sm">{errors.authors.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Publisher</label>
            <input
              type="text"
              {...register('publisher')}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">ISBN</label>
            <input
              type="text"
              {...register('isbn')}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">ISBN13</label>
            <input
              type="text"
              {...register('isbn13')}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Number of Pages</label>
            <input
              type="number"
              {...register('numPages', { min: { value: 0, message: 'Cannot be negative' } })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.numPages && <p className="text-red-600 text-sm">{errors.numPages.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              {...register('stock', { required: true, min: 0 })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Rent per Day (₹)</label>
            <input
              type="number"
              {...register('rentPerDay', { required: true, min: 0 })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
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
