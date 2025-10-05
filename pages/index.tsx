import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">
        Welcome to Sheet Cutting Tracker
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <p className="text-base sm:text-lg mb-4">
          This application helps you manage and track sheet cutting operations for your business.
        </p>
        <p className="text-gray-700 mb-4">
          Use the navigation menu to access different features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
          <li><strong>Dashboard:</strong> View summary statistics and charts</li>
          <li><strong>Stock:</strong> Manage your sheet material inventory</li>
          <li><strong>Orders:</strong> Track customer orders and cutting jobs</li>
          <li><strong>Leftovers:</strong> Manage leftover and offcut pieces</li>
          <li><strong>Customers:</strong> Customer profiles with full order history</li>
          <li><strong>Factories:</strong> Supplier/factory profiles and materials supplied</li>
          <li><strong>Purchases:</strong> Incoming stock tracking with complete traceability</li>
          <li><strong>Visualizer:</strong> Visualize sheet cutting layouts</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-center transition">
          Go to Dashboard
        </Link>
        <Link href="/orders" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-center transition">
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
