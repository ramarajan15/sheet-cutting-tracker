import React, { useEffect, useState } from 'react';
import { readFactories, readPurchases, Factory, Purchase, getPurchasesByFactory } from '@/utils/excelUtils';

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

  const getFactoryPurchases = (factoryName: string) => {
    return getPurchasesByFactory(purchases, factoryName);
  };

  const getFactoryStats = (factoryName: string) => {
    const factoryPurchases = getFactoryPurchases(factoryName);
    const totalPurchases = factoryPurchases.length;
    const totalCost = factoryPurchases.reduce((sum, purchase) => sum + (purchase['Total Cost'] || 0), 0);
    const totalQuantity = factoryPurchases.reduce((sum, purchase) => sum + (purchase.Quantity || 0), 0);
    return { totalPurchases, totalCost, totalQuantity };
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Factory/Supplier Management</h1>
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
              Manage factory and supplier information. Track supplied materials and view purchase history.
            </p>
          </div>
        </div>
      </div>

      {/* Factories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Factories</h3>
          <p className="text-3xl font-bold text-blue-600">{factories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Purchases</h3>
          <p className="text-3xl font-bold text-green-600">{purchases.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Spend</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${purchases.reduce((sum, p) => sum + (p['Total Cost'] || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Factories Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Factory List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplied Materials</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factories.map((factory, index) => {
                const stats = getFactoryStats(factory['Factory Name'] || '');
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {factory['Factory Name']}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{factory['Contact Person']}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{factory.Phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{factory.Email}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{factory['Supplied Materials']}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {stats.totalPurchases}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedFactory(factory['Factory Name'] || null)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Purchases
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factory Purchase History Modal */}
      {selectedFactory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Purchase History - {selectedFactory}</h2>
                <button
                  onClick={() => setSelectedFactory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Factory Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getFactoryStats(selectedFactory).totalPurchases}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${getFactoryStats(selectedFactory).totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {getFactoryStats(selectedFactory).totalQuantity}
                  </p>
                </div>
              </div>

              {/* Purchases Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
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
                    {getFactoryPurchases(selectedFactory).map((purchase, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {purchase['Purchase Date']}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {purchase.Material}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase['Size (mm)']}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.Quantity}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${purchase['Unit Cost']?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${purchase['Total Cost']?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{purchase['Batch/Ref']}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{purchase.Notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
