import React, { useEffect, useState } from 'react';
import { readPurchases, Purchase, getUniqueFactories } from '@/utils/excelUtils';

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFactory, setFilterFactory] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [factories, setFactories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const purchasesData = await readPurchases('SheetCuttingBusinessTemplate.xlsx');
        setPurchases(purchasesData);
        
        // Extract unique factories and materials
        const uniqueFactories = getUniqueFactories(purchasesData);
        const uniqueMaterials = Array.from(new Set(purchasesData.map(p => p.Material).filter(Boolean))) as string[];
        
        setFactories(uniqueFactories);
        setMaterials(uniqueMaterials);
        setLoading(false);
      } catch (error) {
        console.error('Error loading purchases data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesFactory = filterFactory === 'all' || purchase['Factory Name'] === filterFactory;
    const matchesMaterial = filterMaterial === 'all' || purchase.Material === filterMaterial;
    return matchesFactory && matchesMaterial;
  });

  const totalCost = filteredPurchases.reduce((sum, p) => sum + (p['Total Cost'] || 0), 0);
  const totalQuantity = filteredPurchases.reduce((sum, p) => sum + (p.Quantity || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading purchases data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Material Purchases</h1>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="factory-filter" className="text-sm font-medium text-gray-700 mr-2">
              Factory:
            </label>
            <select
              id="factory-filter"
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Factories</option>
              {factories.map((factory) => (
                <option key={factory} value={factory}>
                  {factory}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="material-filter" className="text-sm font-medium text-gray-700 mr-2">
              Material:
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
              Track all material purchases from factories. View purchase details including batch/reference numbers for traceability.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Purchases</h3>
          <p className="text-3xl font-bold text-blue-600">{filteredPurchases.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Quantity</h3>
          <p className="text-3xl font-bold text-green-600">{totalQuantity}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cost</h3>
          <p className="text-3xl font-bold text-purple-600">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Cost per Unit</h3>
          <p className="text-3xl font-bold text-orange-600">
            ${totalQuantity > 0 ? (totalCost / totalQuantity).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Purchase Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase['Purchase Date']}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {purchase['Factory Name']}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase['Size (mm)']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.Quantity}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${purchase['Unit Cost']?.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${purchase['Total Cost']?.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {purchase['Batch/Ref']}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{purchase.Notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
