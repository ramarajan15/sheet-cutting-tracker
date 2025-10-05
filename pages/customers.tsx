import React, { useEffect, useState } from 'react';
import { readCustomers, readExcelFile, Customer, SheetData, getOrdersByCustomer } from '@/utils/excelUtils';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const customersData = await readCustomers('SheetCuttingBusinessTemplate.xlsx');
        const ordersData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        setCustomers(customersData);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading customers data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCustomerOrders = (customerName: string) => {
    return getOrdersByCustomer(orders, customerName);
  };

  const getCustomerStats = (customerName: string) => {
    const customerOrders = getCustomerOrders(customerName);
    const totalOrders = customerOrders.length;
    const totalRevenue = customerOrders.reduce((sum, order) => sum + (order['Total Sale'] || 0), 0);
    const totalProfit = customerOrders.reduce((sum, order) => sum + (order.Profit || 0), 0);
    return { totalOrders, totalRevenue, totalProfit };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading customers data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
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
              Manage customer profiles and view their order history. Data is loaded from the Excel file in the public folder.
            </p>
          </div>
        </div>
      </div>

      {/* Customers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-purple-600">
            {customers.filter(c => c['Customer Name']).length}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Customer List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => {
                const stats = getCustomerStats(customer['Customer Name'] || '');
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {customer['Customer Name']}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{customer.Contact}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{customer.Company}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{customer.Phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{customer.Email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {stats.totalOrders}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedCustomer(customer['Customer Name'] || null)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order History - {selectedCustomer}</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getCustomerStats(selectedCustomer).totalOrders}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${getCustomerStats(selectedCustomer).totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${getCustomerStats(selectedCustomer).totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sale</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCustomerOrders(selectedCustomer).map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order['Order Ref']}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.Date}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.Material}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order['Piece Size (mm)']}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.Qty}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${order['Total Sale']?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${order.Profit?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order['Factory Name'] || 'N/A'}
                        </td>
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
