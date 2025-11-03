"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading transactions...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Transactions</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🏠 Home
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => router.push('/transactions/issue')}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          � Issue Book
        </button>
        <button
          onClick={() => router.push('/transactions/return')}
          className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          🔄 Return Book
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">No transactions found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left text-gray-800">Book</th>
                <th className="border p-3 text-left text-gray-800">Member</th>
                <th className="border p-3 text-left text-gray-800">Issue Date</th>
                <th className="border p-3 text-left text-gray-800">Return Date</th>
                <th className="border p-3 text-left text-gray-800">Rent Fee (₹)</th>
                <th className="border p-3 text-left text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="border p-3 text-gray-900">{t.book?.title || "N/A"}</td>
                  <td className="border p-3 text-gray-900">{t.member?.name || "N/A"}</td>
                  <td className="border p-3 text-gray-900">{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td className="border p-3 text-gray-900">
                    {t.returnDate ? new Date(t.returnDate).toLocaleDateString() : "Not Returned"}
                  </td>
                  <td className="border p-3 text-gray-900">₹{t.rentFee || 0}</td>
                  <td className={`border p-3 font-semibold ${
                      t.status === "issued" ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
