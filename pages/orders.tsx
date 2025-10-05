import React, { useEffect, useState } from 'react';
import { readOrders, readCustomers, Order, Customer, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [materials, setMaterials] = useState<string[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Order>>({
    id: '',
    orderRef: '',
    date: '',
    customerId: '',
    material: '',
    pieceSize: '',
    qty: 0,
    unitSalePrice: 0,
    totalSale: 0,
    unitCost: 0,
    totalCost: 0,
    profit: 0,
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await readOrders('SheetCuttingBusinessTemplate.xlsx');
        const customersData = await readCustomers('SheetCuttingBusinessTemplate.xlsx');
        setOrders(ordersData);
        setCustomers(customersData);
        
        // Extract unique materials
        const uniqueMaterials = Array.from(new Set(ordersData.map(row => row.material).filter(Boolean))) as string[];
        setMaterials(uniqueMaterials);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredOrders = filterMaterial === 'all' 
    ? orders 
    : orders.filter(row => row.material === filterMaterial);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || customerId;
  };

  // CRUD handlers
  const handleAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      id: '',
      orderRef: '',
      date: today,
      customerId: '',
      material: '',
      pieceSize: '',
      qty: 0,
      unitSalePrice: 0,
      totalSale: 0,
      unitCost: 0,
      totalCost: 0,
      profit: 0,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setFormData({ ...order });
    setIsEditModalOpen(true);
  };

  const handleDelete = (order: Order) => {
    setCurrentOrder(order);
    setIsDeleteModalOpen(true);
  };

  const calculateTotals = (qty: number, unitCost: number, unitSalePrice: number) => {
    const totalCost = qty * unitCost;
    const totalSale = qty * unitSalePrice;
    const profit = totalSale - totalCost;
    return { totalCost, totalSale, profit };
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.orderRef || !formData.customerId || !formData.material) {
      alert('Please fill in required fields (ID, Order Ref, Customer, Material)');
      return;
    }

    const { totalCost, totalSale, profit } = calculateTotals(
      formData.qty || 0,
      formData.unitCost || 0,
      formData.unitSalePrice || 0
    );

    const customerName = getCustomerName(formData.customerId || '');

    const newOrder: Order = {
      id: formData.id!,
      orderRef: formData.orderRef!,
      date: formData.date || new Date().toISOString().split('T')[0],
      customerId: formData.customerId!,
      customerName,
      material: formData.material!,
      pieceSize: formData.pieceSize || '',
      qty: formData.qty || 0,
      unitCost: formData.unitCost || 0,
      unitSalePrice: formData.unitSalePrice || 0,
      totalCost,
      totalSale,
      profit,
      notes: formData.notes || ''
    };

    setOrders([...orders, newOrder]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.orderRef || !formData.customerId || !formData.material) {
      alert('Please fill in required fields (ID, Order Ref, Customer, Material)');
      return;
    }

    const { totalCost, totalSale, profit } = calculateTotals(
      formData.qty || 0,
      formData.unitCost || 0,
      formData.unitSalePrice || 0
    );

    const customerName = getCustomerName(formData.customerId || '');

    const updatedOrders = orders.map(o =>
      o.id === currentOrder?.id ? { ...formData as Order, totalCost, totalSale, profit, customerName } : o
    );

    setOrders(updatedOrders);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentOrder) {
      setOrders(orders.filter(o => o.id !== currentOrder.id));
      setIsDeleteModalOpen(false);
      setCurrentOrder(null);
    }
  };

  const handleExport = () => {
    exportToExcel('SheetCuttingBusinessTemplate_Export.xlsx', {
      orders,
      customers
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading orders data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Export to Excel
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Add New Order
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="material-filter" className="text-sm font-medium text-gray-700">
              Filter by Material:
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${filteredOrders.reduce((sum, row) => sum + (row.totalSale || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Cost</h3>
          <p className="text-2xl font-bold text-orange-600">
            ${filteredOrders.reduce((sum, row) => sum + (row.totalCost || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Profit</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${filteredOrders.reduce((sum, row) => sum + (row.profit || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sale</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.orderRef}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName || getCustomerName(order.customerId)}
                    <div className="text-xs text-gray-500">{order.customerId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.pieceSize}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.qty}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${(order.totalCost || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${(order.totalSale || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${(order.profit || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
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
              Track and manage all customer orders with complete material traceability. Each order is linked to a customer and shows which sheet was used (and thus the factory/batch), enabling full end-to-end tracking from supplier to customer.
            </p>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Order" maxWidth="2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ORD001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Ref *</label>
              <input
                type="text"
                value={formData.orderRef}
                onChange={(e) => setFormData({ ...formData, orderRef: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., REF-2024-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Stainless Steel"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piece Size</label>
              <input
                type="text"
                value={formData.pieceSize}
                onChange={(e) => setFormData({ ...formData, pieceSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500x300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
              <input
                type="number"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Sale Price</label>
              <input
                type="number"
                value={formData.unitSalePrice}
                onChange={(e) => setFormData({ ...formData, unitSalePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profit (Auto-calculated)</label>
              <input
                type="number"
                value={calculateTotals(formData.qty || 0, formData.unitCost || 0, formData.unitSalePrice || 0).profit}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
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
              Add Order
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Order Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Order" maxWidth="2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID *</label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Ref *</label>
              <input
                type="text"
                value={formData.orderRef}
                onChange={(e) => setFormData({ ...formData, orderRef: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piece Size</label>
              <input
                type="text"
                value={formData.pieceSize}
                onChange={(e) => setFormData({ ...formData, pieceSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
              <input
                type="number"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Sale Price</label>
              <input
                type="number"
                value={formData.unitSalePrice}
                onChange={(e) => setFormData({ ...formData, unitSalePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profit (Auto-calculated)</label>
              <input
                type="number"
                value={calculateTotals(formData.qty || 0, formData.unitCost || 0, formData.unitSalePrice || 0).profit}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Order" maxWidth="md">
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete order &quot;<strong>{currentOrder?.orderRef}</strong>&quot;?
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
