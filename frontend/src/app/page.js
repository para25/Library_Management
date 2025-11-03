'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📚 Library Management System
          </h1>
          <p className="text-lg text-gray-600">
            Manage your books, members, and transactions efficiently
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Books Card */}
          <div 
            onClick={() => router.push('/books')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Books</h2>
              <p className="text-gray-600 mb-4">
                Manage your book inventory, add new books, and track availability
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                View Books
              </button>
            </div>
          </div>

          {/* Members Card */}
          <div 
            onClick={() => router.push('/members')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Members</h2>
              <p className="text-gray-600 mb-4">
                Manage library members and track their outstanding debts
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                View Members
              </button>
            </div>
          </div>

          {/* Transactions Card */}
          <div 
            onClick={() => router.push('/transactions')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Transactions</h2>
              <p className="text-gray-600 mb-4">
                Issue and return books, calculate rental fees
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                View Transactions
              </button>
            </div>
          </div>

        </div>

        {/* Import Section */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div 
            onClick={() => router.push('/import')}
            className="bg-linear-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-shadow cursor-pointer text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">📥 Import Books from Frappe</h2>
                <p className="text-lg opacity-90">
                  Import books directly from the Frappe library API
                </p>
              </div>
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Import Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
