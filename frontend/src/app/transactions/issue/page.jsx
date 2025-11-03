"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";

export default function IssueBookPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: "", memberId: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, memberRes] = await Promise.all([
        api.get("/books"),
        api.get("/members"),
      ]);
      setBooks(bookRes.data.books || []);
      setMembers(memberRes.data.members || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load books and members");
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/transactions/issue", {
        bookId: form.bookId,
        memberId: form.memberId,
      });
      setMessage("✅ Book issued successfully!");
      setForm({ bookId: "", memberId: "" });
      // Refresh data to update available books
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to issue book";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📕 Issue a Book</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/transactions')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🏠 Home
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-900">Select Book</label>
            <select
              className="w-full border rounded p-2 text-gray-900"
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              required
            >
              <option value="">-- Choose a Book --</option>
              {books.filter(b => b.stock > 0).map((b) => (
                <option key={b._id} value={b._id}>
                  {b.title} (Stock: {b.stock})
                </option>
              ))}
            </select>
            {books.filter(b => b.stock > 0).length === 0 && (
              <p className="text-sm text-red-600 mt-1">No books available in stock</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-900">Select Member</label>
            <select
              className="w-full border rounded p-2 text-gray-900"
              value={form.memberId}
              onChange={(e) => setForm({ ...form, memberId: e.target.value })}
              required
            >
              <option value="">-- Choose a Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} - {m.email} (Debt: ₹{m.outstandingDebt})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Issue Book
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
