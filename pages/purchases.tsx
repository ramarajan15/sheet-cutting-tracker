import React, { useEffect, useState } from 'react';
import { readPurchases, readFactories, Purchase, Factory } from '@/utils/excelUtils';

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFactory, setFilterFactory] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const purchasesData = await readPurchases('SheetCuttingBusinessTemplate.xlsx');
        const factoriesData = await readFactories('SheetCuttingBusinessTemplate.xlsx');
        setPurchases(purchasesData);
        setFactories(factoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading purchases data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const uniqueMaterials = Array.from(new Set(purchases.map(p => p.material).filter(Boolean)));

  const filteredPurchases = purchases.filter(purchase => {
    const matchesFactory = filterFactory === 'all' || purchase.factoryId === filterFactory;
    const matchesMaterial = filterMaterial === 'all' || purchase.material === filterMaterial;
    return matchesFactory && matchesMaterial;
  });

  const totalPurchases = filteredPurchases.length;
  const totalCost = filteredPurchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const totalQty = filteredPurchases.reduce((sum, p) => sum + (p.qty || 0), 0);

  const getFactoryName = (factoryId: string) => {
    const factory = factories.find(f => f.id === factoryId);
    return factory?.name || factoryId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading purchases data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Purchase Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Purchases</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{totalPurchases}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Sheets</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{totalQty}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Total Cost</h3>
          <p className="text-3xl font-bold text-purple-900 mt-2">${totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Factory
            </label>
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Factories</option>
              {factories.map(factory => (
                <option key={factory.id} value={factory.id}>
                  {factory.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Material
            </label>
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Materials</option>
              {uniqueMaterials.map(material => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Incoming Stock Purchases</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track all incoming stock from factories with complete traceability (date, factory, material, size, qty, cost, batch reference)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thickness</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Ref</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{getFactoryName(purchase.factoryId)}</div>
                    <div className="text-xs text-gray-500">{purchase.factoryId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.material}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.size}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.thickness || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.qty}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${purchase.unitCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${purchase.totalCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.batchRef || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPurchases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No purchases found matching the selected filters.</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                Purchase data is loaded from the &apos;Purchases&apos; sheet in the Excel file. Each purchase represents incoming stock and includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Factory/supplier source for complete traceability</li>
                <li>Material type, size, and quantity</li>
                <li>Cost information (unit and total)</li>
                <li>Batch/reference number for tracking</li>
                <li>Date of purchase for inventory management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
