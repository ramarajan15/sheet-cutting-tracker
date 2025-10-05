import React, { useEffect, useState } from 'react';
import { readCustomers, readOrders, Customer, Order } from '@/utils/excelUtils';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const customersData = await readCustomers('SheetCuttingBusinessTemplate.xlsx');
        const ordersData = await readOrders('SheetCuttingBusinessTemplate.xlsx');
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

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const calculateCustomerTotal = (customerId: string) => {
    const customerOrders = getCustomerOrders(customerId);
    return customerOrders.reduce((total, order) => total + (order.totalSale || 0), 0);
  };

  const calculateCustomerProfit = (customerId: string) => {
    const customerOrders = getCustomerOrders(customerId);
    return customerOrders.reduce((total, order) => total + (order.profit || 0), 0);
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
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{customers.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Orders</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Active Customers</h3>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {customers.filter(c => getCustomerOrders(c.id).length > 0).length}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Customer Profiles</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track customer information and their complete order history
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => {
                const customerOrders = getCustomerOrders(customer.id);
                const totalSales = calculateCustomerTotal(customer.id);
                const totalProfit = calculateCustomerProfit(customer.id);
                
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div>{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customerOrders.length}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${totalSales.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${totalProfit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedCustomer === customer.id ? 'Hide' : 'View'} Orders
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order History for Selected Customer */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <h2 className="text-xl font-bold text-gray-800">
              Order History - {customers.find(c => c.id === selectedCustomer)?.name}
            </h2>
          </div>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCustomerOrders(selectedCustomer).map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderRef}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.material}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.pieceSize}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.qty}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(order.totalSale || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={(order.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${(order.profit || 0).toFixed(2)}
                      </span>
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
              Customer data is loaded from the &apos;Customers&apos; sheet in the Excel file. Each order is linked to a customer for complete order history tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
