import React, { useEffect, useState } from 'react';
import { readFactories, readPurchases, Factory, Purchase } from '@/utils/excelUtils';

export default function Factories() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const factoriesData = await readFactories('SheetCuttingBusinessTemplate.xlsx');
        const purchasesData = await readPurchases('SheetCuttingBusinessTemplate.xlsx');
        setFactories(factoriesData);
        setPurchases(purchasesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading factories data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFactoryPurchases = (factoryId: string) => {
    return purchases.filter(purchase => purchase.factoryId === factoryId);
  };

  const calculateFactoryTotal = (factoryId: string) => {
    const factoryPurchases = getFactoryPurchases(factoryId);
    return factoryPurchases.reduce((total, purchase) => total + (purchase.totalCost || 0), 0);
  };

  const getFactoryMaterials = (factoryId: string) => {
    const factoryPurchases = getFactoryPurchases(factoryId);
    const materials = new Set(factoryPurchases.map(p => p.material));
    return Array.from(materials);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading factories data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Factory/Supplier Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Factories</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{factories.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Purchases</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{purchases.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Total Spent</h3>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            ${purchases.reduce((total, p) => total + (p.totalCost || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Factories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Factory Profiles</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track supplier/factory information and materials supplied
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials Supplied</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factories.map((factory) => {
                const factoryPurchases = getFactoryPurchases(factory.id);
                const totalSpent = calculateFactoryTotal(factory.id);
                const materials = getFactoryMaterials(factory.id);
                
                return (
                  <tr key={factory.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {factory.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factory.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factory.location || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div>{factory.email}</div>
                      <div className="text-xs text-gray-500">{factory.phone}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {materials.map((material, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factoryPurchases.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${totalSpent.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedFactory(selectedFactory === factory.id ? null : factory.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedFactory === factory.id ? 'Hide' : 'View'} Purchases
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase History for Selected Factory */}
      {selectedFactory && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <h2 className="text-xl font-bold text-gray-800">
              Purchase History - {factories.find(f => f.id === selectedFactory)?.name}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Ref</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFactoryPurchases(selectedFactory).map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.material}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.size}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.qty}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(purchase.unitCost || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(purchase.totalCost || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.batchRef || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Factory data is loaded from the &apos;Factories&apos; sheet in the Excel file. Each purchase is linked to a factory for complete supply chain traceability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
