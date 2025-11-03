// components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));

  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 bg-yellow-700 rounded disabled:opacity-50">Prev</button>
      <span>Page {page} of {pages}</span>
      <button onClick={next} disabled={page === pages} className="px-3 py-1 bg-yellow-700 rounded disabled:opacity-50">Next</button>
    </div>
  );
}
