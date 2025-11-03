"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";

export default function ReturnBookPage() {
  const router = useRouter();
  const [issued, setIssued] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssued();
  }, []);

  const fetchIssued = async () => {
    try {
      const res = await api.get("/transactions");
      const data = res.data.transactions || [];
      setIssued(data.filter((t) => t.status === "issued"));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert("Failed to load issued books");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = returnDate ? { returnDate } : {};
      const res = await api.put(`/transactions/return/${selectedId}`, payload);
      setMessage(`✅ Book returned successfully! Rent Fee: ₹${res.data.transaction.rentFee}`);
      setSelectedId("");
      setReturnDate("");
      // Refresh the list
      fetchIssued();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to return book";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔄 Return a Book</h1>
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
        <form onSubmit={handleReturn} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-900">Select Issued Book</label>
            <select
              className="w-full border rounded p-2 text-gray-900"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="">-- Choose a Transaction --</option>
              {issued.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.book?.title} → {t.member?.name} (Issued: {new Date(t.issueDate).toLocaleDateString()})
                </option>
              ))}
            </select>
            {issued.length === 0 && (
              <p className="text-sm text-gray-600 mt-1">No books currently issued</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-900">Return Date (Optional)</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border rounded p-2 text-gray-900"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty to use today&apos;s date</p>
          </div>

          <button
            type="submit"
            disabled={issued.length === 0}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            Return Book
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
