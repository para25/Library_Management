'use client';

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import BookCard from '../../components/BookCard';
import Pagination from '../../components/Pagination';
import { useRouter } from 'next/navigation';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let res;
      if (q && q.trim().length > 0) {
        res = await api.get('/books/search', { params: { q, page, limit } });
        setBooks(res.data.results || []);
        setPages(res.data.pages || 1);
      } else {
        res = await api.get('/books', { params: { page, limit } });
        setBooks(res.data.books || []);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error('Fetch books error', err);
      alert('Failed to fetch books. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/books/add')} className="px-4 py-2 bg-green-600 text-white rounded">Add Book</button>
        </div>
      </div>

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or author..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Search</button>
        <button type="button"  onClick={() => { setQ(''); setPage(1); fetchBooks(); }} className="px-4 py-2 bg-yellow-600 rounded">Reset</button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && books.length === 0 && <p>No books found.</p>}

      <div className="grid gap-3">
        {books.map(book => (
          <BookCard
            key={book._id}
            book={book}
          />
        ))}
      </div>

      <Pagination page={page} pages={pages} onChange={(p) => setPage(p)} />
    </div>
  );
}
