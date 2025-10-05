import React, { useEffect, useState } from 'react';
import { readCustomers, readOrders, Customer, Order, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Customer>>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

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

  // CRUD handlers
  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({ ...customer });
    setIsEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const newCustomer: Customer = {
      id: formData.id,
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      notes: formData.notes || ''
    };

    setCustomers([...customers, newCustomer]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const updatedCustomers = customers.map(c =>
      c.id === currentCustomer?.id ? { ...formData as Customer } : c
    );

    setCustomers(updatedCustomers);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentCustomer) {
      setCustomers(customers.filter(c => c.id !== currentCustomer.id));
      setIsDeleteModalOpen(false);
      setCurrentCustomer(null);
    }
  };

  const handleExport = () => {
    exportToExcel('SheetCuttingBusinessTemplate_Export.xlsx', {
      customers,
      orders
    });
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
          >
            Export to Excel
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
          >
            + Add New Customer
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide">Total Customers</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">{customers.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-green-600 uppercase tracking-wide">Total Orders</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-purple-600 uppercase tracking-wide">Active Customers</h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-2">
            {customers.filter(c => getCustomerOrders(c.id).length > 0).length}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6">
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Customer Profiles</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {selectedCustomer === customer.id ? 'Hide' : 'View'} Orders
                        </button>
                      </div>
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

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Customer" maxWidth="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CUST001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ABC Manufacturing"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1-555-0123"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Customer" maxWidth="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID *</label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Customer" maxWidth="md">
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete customer &quot;<strong>{currentCustomer?.name}</strong>&quot;?
          </p>
          <p className="text-sm text-red-600 mb-6">
            Warning: This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
