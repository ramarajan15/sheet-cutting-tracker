import React, { useEffect, useState } from 'react';
import { readExcelFile, SheetData } from '@/utils/excelUtils';

export default function Leftovers() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const excelData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        // Filter only items with leftover area
        const leftoverData = excelData.filter(row => (row['Leftover Area (m²)'] || 0) > 0);
        setData(leftoverData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading leftovers data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalLeftoverArea = data.reduce((sum, row) => sum + (row['Leftover Area (m²)'] || 0), 0);
  const usedOffcuts = data.filter(row => row['Offcut Used? (Y/N)'] === 'Y').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading leftovers data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leftovers Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Leftovers</h3>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Leftover Area</h3>
          <p className="text-3xl font-bold text-orange-600">{totalLeftoverArea.toFixed(2)} m²</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Used Offcuts</h3>
          <p className="text-3xl font-bold text-green-600">{usedOffcuts}</p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Track leftover pieces and offcuts from sheet cutting operations. Optimize material usage by reusing offcuts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Leftover Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piece Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leftover Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offcut Used?</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row['Order Ref']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Piece Size (mm)']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                    {row['Leftover Area (m²)']?.toFixed(2)} m²
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row['Offcut Used? (Y/N)'] === 'Y' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row['Offcut Used? (Y/N)']}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                    {row['Batch/Ref'] || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                    {row['Factory Name'] || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{row.Notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
