// components/BookCard.jsx
import React from 'react';

export default function BookCard({ book }) {
  return (
    <div className="border rounded-md p-4 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">Authors: {typeof book.authors === 'string' ? book.authors : (book.authors || []).join(', ')}</p>
        {book.publisher && <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>}
        {book.isbn && <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>}
        {typeof book.stock !== 'undefined' && (
          <p className={`mt-2 font-medium ${book.stock <= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {book.stock <= 0 ? 'Not available' : `In stock: ${book.stock}`}
          </p>
        )}
      </div>
    </div>
  );
}
