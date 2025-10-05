import React, { useEffect, useState } from 'react';
import { readStockSheets, readOrders, readProducts, StockSheet, Order, Product } from '@/utils/excelUtils';

interface LeftoverPiece {
  id: string;
  sheetId: string;
  productId: string;
  productName: string;
  originalLength: number;
  originalWidth: number;
  remainingLength: number;
  remainingWidth: number;
  remainingArea: number;
  usedArea: number;
  totalArea: number;
  dateCreated: string;
  status: 'available' | 'used';
  fromOrders: string[];
}

export default function Leftovers() {
  const [stockSheets, setStockSheets] = useState<StockSheet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leftovers, setLeftovers] = useState<LeftoverPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateLeftovers = (
      stock: StockSheet[],
      orders: Order[],
      products: Product[]
    ): LeftoverPiece[] => {
      const leftovers: LeftoverPiece[] = [];

      // For each stock sheet, calculate leftover after cuts
      stock.forEach((sheet) => {
        const product = products.find(p => p.id === sheet.productId);
        if (!product) return;

        // Parse sheet dimensions from size (e.g., "2440x1220")
        const sizeParts = sheet.size?.split('x') || [];
        const sheetLength = sizeParts.length >= 1 ? parseFloat(sizeParts[0]) : 0;
        const sheetWidth = sizeParts.length >= 2 ? parseFloat(sizeParts[1]) : 0;
        const totalSheetArea = (sheetLength * sheetWidth) / 1000000; // Convert mm² to m²

        // Find all orders that used pieces from this product
        const relatedOrders = orders.filter(order => 
          order.items?.some(item => item.productId === sheet.productId)
        );

        // Calculate total area used from orders
        let totalUsedArea = 0;
        const orderRefs: string[] = [];

        relatedOrders.forEach(order => {
          order.items?.forEach(item => {
            if (item.productId === sheet.productId) {
              const pieceArea = (item.length * item.width * item.qty) / 1000000; // Convert mm² to m²
              totalUsedArea += pieceArea;
              orderRefs.push(order.orderRef);
            }
          });
        });

        // Calculate remaining area
        const remainingArea = totalSheetArea - totalUsedArea;

        // Only add to leftovers if there's remaining area and the sheet has been used
        if (remainingArea > 0 && totalUsedArea > 0) {
          // Estimate remaining dimensions (simplified - assumes one leftover piece)
          const utilizationRatio = totalUsedArea / totalSheetArea;
          const remainingLength = sheetLength;
          const remainingWidth = sheetWidth * (1 - utilizationRatio);

          leftovers.push({
            id: `leftover-${sheet.id}`,
            sheetId: sheet.id,
            productId: sheet.productId,
            productName: product.name,
            originalLength: sheetLength,
            originalWidth: sheetWidth,
            remainingLength: remainingLength,
            remainingWidth: remainingWidth,
            remainingArea: remainingArea,
            usedArea: totalUsedArea,
            totalArea: totalSheetArea,
            dateCreated: sheet.dateReceived,
            status: sheet.status === 'leftover' || sheet.status === 'used' ? 'used' : 'available',
            fromOrders: [...new Set(orderRefs)] // Remove duplicates
          });
        }
      });

      return leftovers;
    };

    const loadData = async () => {
      try {
        const [stockData, ordersData, productsData] = await Promise.all([
          readStockSheets('SheetCuttingBusinessTemplate.xlsx'),
          readOrders('SheetCuttingBusinessTemplate.xlsx'),
          readProducts('SheetCuttingBusinessTemplate.xlsx')
        ]);
        
        setStockSheets(stockData);
        setOrders(ordersData);
        setProducts(productsData);
        
        // Calculate leftovers from stock and orders
        const calculatedLeftovers = calculateLeftovers(stockData, ordersData, productsData);
        setLeftovers(calculatedLeftovers);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading leftovers data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || productId;
  };

  const totalLeftoverArea = leftovers.reduce((sum, leftover) => sum + leftover.remainingArea, 0);
  const availableLeftovers = leftovers.filter(l => l.status === 'available');
  const usedLeftovers = leftovers.filter(l => l.status === 'used');

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
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Leftover Pieces</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{leftovers.length}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Sheets with leftovers</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Leftover Area</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">{totalLeftoverArea.toFixed(2)} m²</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Unused material area</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Available Leftovers</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{availableLeftovers.length}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Can be reused</p>
        </div>
      </div>

      {/* Leftovers Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Leftover Details</h2>
        {leftovers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No leftovers found. This could mean:</p>
            <ul className="list-disc list-inside mt-2">
              <li>All sheets have been fully utilized</li>
              <li>No orders have been placed yet</li>
              <li>Stock data is not available</li>
            </ul>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheet ID</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Size (mm)</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Remaining (mm)</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Area</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leftovers.map((leftover) => {
                    const utilizationPercent = ((leftover.usedArea / leftover.totalArea) * 100).toFixed(1);
                    return (
                      <tr key={leftover.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">
                          {leftover.sheetId}
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {leftover.productName}
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {leftover.originalLength.toFixed(0)}×{leftover.originalWidth.toFixed(0)}
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {leftover.remainingLength.toFixed(0)}×{leftover.remainingWidth.toFixed(0)}
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-orange-600">
                          {leftover.remainingArea.toFixed(2)} m²
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${utilizationPercent}%` }}
                              ></div>
                            </div>
                            <span>{utilizationPercent}%</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            leftover.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {leftover.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                          {leftover.fromOrders.slice(0, 3).join(', ')}
                          {leftover.fromOrders.length > 3 && ` +${leftover.fromOrders.length - 3} more`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Visual Representation Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Visual Representation</h2>
        <p className="text-sm text-gray-600 mb-4">
          This shows a simplified visualization of sheet utilization. Each bar represents a sheet with leftovers.
        </p>
        <div className="space-y-4">
          {leftovers.slice(0, 10).map((leftover) => {
            const usedPercent = (leftover.usedArea / leftover.totalArea) * 100;
            const remainingPercent = 100 - usedPercent;
            
            return (
              <div key={leftover.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {leftover.sheetId} - {leftover.productName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {leftover.originalLength.toFixed(0)}×{leftover.originalWidth.toFixed(0)} mm
                  </span>
                </div>
                <div className="flex h-10 rounded overflow-hidden">
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${usedPercent}%` }}
                  >
                    {usedPercent.toFixed(1)}% Used
                  </div>
                  <div 
                    className="bg-orange-200 flex items-center justify-center text-orange-800 text-xs font-medium"
                    style={{ width: `${remainingPercent}%` }}
                  >
                    {remainingPercent.toFixed(1)}% Leftover
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Remaining: {leftover.remainingArea.toFixed(2)} m² | Used: {leftover.usedArea.toFixed(2)} m²
                </div>
              </div>
            );
          })}
          {leftovers.length > 10 && (
            <p className="text-sm text-gray-500 text-center">
              Showing top 10 of {leftovers.length} leftovers
            </p>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Understanding Leftovers</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Leftovers represent the uncut portions of sheets after all ordered pieces have been cut</li>
                <li>These can be added back to stock and used for future smaller orders</li>
                <li>The system calculates remaining area by comparing stock sheets with order items</li>
                <li>Available leftovers can be reused, while &quot;used&quot; status indicates already repurposed pieces</li>
                <li>Regular review of leftovers helps optimize material usage and reduce waste</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
