'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../utils/api';

export default function AddMember() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('id');

  const [member, setMember] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memberId) fetchMember();
  }, [memberId]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/members/${memberId}`);
      const data = res.data;
      setMember({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (err) {
      alert('Failed to fetch member details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (memberId) {
        await api.put(`/members/${memberId}`, member);
        alert('Member updated successfully!');
      } else {
        await api.post('/members', member);
        alert('Member added successfully!');
      }
      router.push('/members');
    } catch (err) {
      alert('Failed to save member');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {memberId ? 'Edit Member' : 'Add New Member'}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={member.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {memberId ? 'Update Member' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/members')}
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