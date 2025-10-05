import React, { useEffect, useState } from 'react';
import { readExcelFile, SheetData, getStockByMaterial } from '@/utils/excelUtils';

export default function Stock() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockSummary, setStockSummary] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const excelData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        setData(excelData);
        
        const summary = getStockByMaterial(excelData);
        setStockSummary(summary);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading stock data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading stock data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Stock Summary by Material</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stockSummary).map(([material, area]) => (
            <div key={material} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-700">{material}</h3>
              <p className="text-2xl font-bold text-blue-600">{area.toFixed(2)} m²</p>
              <p className="text-sm text-gray-500">Total area used</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Stock Details with Traceability</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piece Size (mm)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area Used</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leftover</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheet Used</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Piece Size (mm)']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Qty}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Total Area Used (m²)']?.toFixed(2)} m²</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {row['Factory Name'] ? (
                      <div>
                        <div className="font-medium">{row['Factory Name']}</div>
                        <div className="text-xs text-gray-500">{row['Factory ID']}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row['Batch Ref'] || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Leftover Area (m²)']?.toFixed(2)} m²</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${row['Sheet Used (Y/N)'] === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {row['Sheet Used (Y/N)']}
                    </span>
                  </td>
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
              This page displays stock information with full traceability from the Excel file. Each sheet is tracked by dimensions, cost, purchase batch/factory for complete supply chain visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
