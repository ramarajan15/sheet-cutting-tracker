import React, { useEffect, useState } from 'react';
import { readStockSheets, readFactories, readProducts, StockSheet, Factory, Product } from '@/utils/excelUtils';

interface StockSummary {
  totalSheets: number;
  availableSheets: number;
  usedSheets: number;
  inUseSheets: number;
  leftoverSheets: number;
  byProduct: Record<string, { total: number; available: number; used: number }>;
}

export default function Stock() {
  const [data, setData] = useState<StockSheet[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockSummary, setStockSummary] = useState<StockSummary>({
    totalSheets: 0,
    availableSheets: 0,
    usedSheets: 0,
    inUseSheets: 0,
    leftoverSheets: 0,
    byProduct: {}
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stockData, factoriesData, productsData] = await Promise.all([
          readStockSheets('SheetCuttingBusinessTemplate.xlsx'),
          readFactories('SheetCuttingBusinessTemplate.xlsx'),
          readProducts('SheetCuttingBusinessTemplate.xlsx')
        ]);
        
        setData(stockData);
        setFactories(factoriesData);
        setProducts(productsData);
        
        // Calculate stock summary
        const summary: StockSummary = {
          totalSheets: stockData.length,
          availableSheets: stockData.filter(s => s.status === 'available').length,
          usedSheets: stockData.filter(s => s.status === 'used').length,
          inUseSheets: stockData.filter(s => s.status === 'in-use').length,
          leftoverSheets: stockData.filter(s => s.status === 'leftover').length,
          byProduct: {}
        };

        // Group by product
        stockData.forEach(sheet => {
          const productKey = sheet.productName || sheet.productId;
          if (!summary.byProduct[productKey]) {
            summary.byProduct[productKey] = { total: 0, available: 0, used: 0 };
          }
          summary.byProduct[productKey].total += 1;
          if (sheet.status === 'available') {
            summary.byProduct[productKey].available += 1;
          } else if (sheet.status === 'used') {
            summary.byProduct[productKey].used += 1;
          }
        });

        setStockSummary(summary);
        setLoading(false);
      } catch (error) {
        console.error('Error loading stock data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFactoryName = (factoryId: string): string => {
    const factory = factories.find(f => f.id === factoryId);
    return factory?.name || factoryId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading stock data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Stock Management</h1>
      
      {/* Overall Stock Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Stock Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-sm text-gray-600">Total Sheets</h3>
            <p className="text-2xl font-bold text-blue-600">{stockSummary.totalSheets}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-sm text-gray-600">Available</h3>
            <p className="text-2xl font-bold text-green-600">{stockSummary.availableSheets}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
            <h3 className="font-semibold text-sm text-gray-600">In Use</h3>
            <p className="text-2xl font-bold text-yellow-600">{stockSummary.inUseSheets}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
            <h3 className="font-semibold text-sm text-gray-600">Used</h3>
            <p className="text-2xl font-bold text-red-600">{stockSummary.usedSheets}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
            <h3 className="font-semibold text-sm text-gray-600">Leftovers</h3>
            <p className="text-2xl font-bold text-purple-600">{stockSummary.leftoverSheets}</p>
          </div>
        </div>
      </div>

      {/* Stock by Product */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Stock Summary by Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stockSummary.byProduct).map(([product, counts]) => (
            <div key={product} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-base text-gray-700 break-words mb-2">{product}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total: <span className="font-bold text-blue-600">{counts.total}</span></span>
                <span className="text-gray-600">Available: <span className="font-bold text-green-600">{counts.available}</span></span>
                <span className="text-gray-600">Used: <span className="font-bold text-red-600">{counts.used}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Stock Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Stock Details with Traceability</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thickness</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Ref</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((sheet, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {sheet.id}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="font-medium">{sheet.productName || sheet.productId}</div>
                      <div className="text-xs text-gray-500">{sheet.productId}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {sheet.size}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {sheet.thickness || '-'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sheet.status === 'available' ? 'bg-green-100 text-green-800' :
                        sheet.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' :
                        sheet.status === 'used' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {sheet.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="font-medium">{getFactoryName(sheet.factoryId)}</div>
                      <div className="text-xs text-gray-500">{sheet.factoryId}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {sheet.batchRef || '-'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {sheet.dateReceived}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {sheet.purchaseId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No stock data available</p>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs sm:text-sm text-blue-700">
              This page displays current stock inventory with full traceability. Each stock sheet is linked to its purchase order, factory supplier, and batch reference for complete supply chain visibility. Status indicators show whether sheets are available, in-use, used, or leftover pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
