import React, { useEffect, useState } from 'react';
import { readExcelFile, SheetData } from '@/utils/excelUtils';

export default function Leftovers() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const excelData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        setData(excelData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading leftovers data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter rows with leftover area
  const leftoversData = data.filter(row => (row['Leftover Area (m²)'] || 0) > 0);
  const totalLeftoverArea = leftoversData.reduce((sum, row) => sum + (row['Leftover Area (m²)'] || 0), 0);
  const offcutsUsed = leftoversData.filter(row => row['Offcut Used? (Y/N)'] === 'Y').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading leftovers data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leftover & Offcut Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Leftovers</h3>
          <p className="text-3xl font-bold text-blue-600">{leftoversData.length}</p>
          <p className="text-sm text-gray-500 mt-1">Orders with leftovers</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Leftover Area</h3>
          <p className="text-3xl font-bold text-orange-600">{totalLeftoverArea.toFixed(2)} m²</p>
          <p className="text-sm text-gray-500 mt-1">Unused material area</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Offcuts Reused</h3>
          <p className="text-3xl font-bold text-green-600">{offcutsUsed}</p>
          <p className="text-sm text-gray-500 mt-1">Successfully reused offcuts</p>
        </div>
      </div>

      {/* Leftovers Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Leftover Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piece Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area Used</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leftover Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offcut Used?</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leftoversData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row['Order Ref']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Piece Size (mm)']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Total Area Used (m²)']?.toFixed(2)} m²</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                    {row['Leftover Area (m²)']?.toFixed(2)} m²
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row['Offcut Used? (Y/N)'] === 'Y' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row['Offcut Used? (Y/N)']}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{row.Notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Leftover Management Tips</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Track leftover pieces to maximize material efficiency</li>
                <li>Mark offcuts as &quot;used&quot; when they are repurposed for smaller orders</li>
                <li>Consider organizing leftovers by size and material type</li>
                <li>Regular inventory of leftovers helps reduce waste</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
