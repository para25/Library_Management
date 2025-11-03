'use client';

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (query = '') => {
    try {
      setLoading(true);
      let res;
      if (query && query.trim()) {
        // Use search endpoint with 'q' parameter
        res = await api.get('/members/search', { params: { q: query } });
        setMembers(res.data.results || []);
      } else {
        // Use regular get all members endpoint
        res = await api.get('/members');
        setMembers(res.data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      alert('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members Management</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🏠 Home
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="border px-3 py-2 rounded w-64"
          />
          <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
            Search
          </button>
          <button 
            type="button" 
            onClick={() => { setSearch(''); fetchMembers(); }} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset
          </button>
        </form>

        <button
          onClick={() => router.push('/members/add')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Member
        </button>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-gray-800">Name</th>
              <th className="p-2 border text-gray-800">Email</th>
              <th className="p-2 border text-gray-800">Phone</th>
              <th className="p-2 border text-gray-800">Outstanding Debt (₹)</th>
              <th className="p-2 border text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m._id} className="text-center border-t">
                <td className="p-2 border">{m.name}</td>
                <td className="p-2 border">{m.email}</td>
                <td className="p-2 border">{m.phone || '-'}</td>
                <td className="p-2 border text-red-600 font-semibold">
                  ₹{m.outstandingDebt}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
