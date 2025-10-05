import React, { useEffect, useState } from 'react';
import { readExcelFile, SheetData } from '@/utils/excelUtils';

export default function Orders() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [materials, setMaterials] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const excelData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        setData(excelData);
        
        // Extract unique materials
        const uniqueMaterials = Array.from(new Set(excelData.map(row => row.Material).filter(Boolean))) as string[];
        setMaterials(uniqueMaterials);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = filterMaterial === 'all' 
    ? data 
    : data.filter(row => row.Material === filterMaterial);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading orders data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="material-filter" className="text-sm font-medium text-gray-700">
            Filter by Material:
          </label>
          <select
            id="material-filter"
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Materials</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${filteredData.reduce((sum, row) => sum + (row['Total Sale'] || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Cost</h3>
          <p className="text-2xl font-bold text-orange-600">
            ${filteredData.reduce((sum, row) => sum + (row['Total Cost'] || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Profit</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${filteredData.reduce((sum, row) => sum + (row.Profit || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sale</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row['Order Ref']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Piece Size (mm)']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Qty}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${row['Total Cost']?.toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${row['Total Sale']?.toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${row.Profit?.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{row.Notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Track and manage all customer orders. Data is loaded from the Excel file in the public folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
