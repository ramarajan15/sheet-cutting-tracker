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
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Leftover & Offcut Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Leftovers</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{leftoversData.length}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Orders with leftovers</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Leftover Area</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">{totalLeftoverArea.toFixed(2)} m²</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Unused material area</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Offcuts Reused</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{offcutsUsed}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Successfully reused offcuts</p>
        </div>
      </div>

      {/* Leftovers Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Leftover Details</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Sheet</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piece Size</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area Used</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leftover Area</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offcut Used?</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leftoversData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">{row['Order Ref']}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row.Date}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row.Material}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row.Customer}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {row['Sheet ID'] || '-'}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                    {row['Factory Name'] ? (
                      <div>
                        <div className="font-medium">{row['Factory Name']}</div>
                        <div className="text-xs text-gray-500">{row['Factory ID']}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row['Piece Size (mm)']}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row['Total Area Used (m²)']?.toFixed(2)} m²</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-orange-600">
                    {row['Leftover Area (m²)']?.toFixed(2)} m²
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row['Offcut Used? (Y/N)'] === 'Y' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row['Offcut Used? (Y/N)']}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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
                <li>Track leftover pieces by actual length/width and link to parent sheet for complete traceability</li>
                <li>Each leftover is linked to its parent sheet, showing the original factory and purchase batch</li>
                <li>Mark offcuts as &quot;used&quot; when they are repurposed for smaller orders</li>
                <li>Consider organizing leftovers by size and material type</li>
                <li>Regular inventory of leftovers helps reduce waste and maximize material efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
