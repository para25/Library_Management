'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            Library Management
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              href="/books" 
              className={`${
                isActive('/books') 
                  ? 'text-white font-semibold border-b-2 border-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Books
            </Link>
            <Link 
              href="/members" 
              className={`${
                isActive('/members') 
                  ? 'text-white font-semibold border-b-2 border-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Members
            </Link>
            <Link 
              href="/transactions" 
              className={`${
                isActive('/transactions') 
                  ? 'text-white font-semibold border-b-2 border-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Transactions
            </Link>
            <Link 
              href="/import" 
              className={`${
                isActive('/import') 
                  ? 'text-white font-semibold border-b-2 border-white' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Import
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
