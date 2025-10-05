import React, { useEffect, useState } from 'react';
import { readOrders, readCustomers, readProducts, readStockSheets, Order, OrderItem, Customer, Product, StockSheet, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockSheets, setStockSheets] = useState<StockSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [productsFilter, setProductsFilter] = useState<string[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Form state for order-level fields
  const [formData, setFormData] = useState<Partial<Order>>({
    id: '',
    orderRef: '',
    date: '',
    customerId: '',
    items: [],
    notes: ''
  });

  // State for line items being edited
  const [lineItems, setLineItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await readOrders('SheetCuttingBusinessTemplate.xlsx');
        const customersData = await readCustomers('SheetCuttingBusinessTemplate.xlsx');
        const productsData = await readProducts('SheetCuttingBusinessTemplate.xlsx');
        const stockData = await readStockSheets('SheetCuttingBusinessTemplate.xlsx');
        setOrders(ordersData);
        setCustomers(customersData);
        setProducts(productsData);
        setStockSheets(stockData);
        
        // Extract unique products from all order items
        const uniqueProducts = new Set<string>();
        ordersData.forEach(order => {
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              if (item.productId) uniqueProducts.add(item.productId);
            });
          }
        });
        setProductsFilter(Array.from(uniqueProducts));
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredOrders = filterProduct === 'all' 
    ? orders 
    : orders.filter(order => {
        if (order.items && order.items.length > 0) {
          return order.items.some(item => item.productId === filterProduct);
        }
        return false;
      });

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || customerId;
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || productId;
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getStockInfo = (productId: string) => {
    // Count stock sheets for this product
    const productSheets = stockSheets.filter(sheet => sheet.productId === productId);
    const availableSheets = productSheets.filter(sheet => sheet.status === 'available');
    const leftoverSheets = productSheets.filter(sheet => sheet.status === 'leftover');
    
    return {
      totalSheets: productSheets.length,
      availableSheets: availableSheets.length,
      leftoverSheets: leftoverSheets.length,
      hasStock: productSheets.length > 0,
      hasLeftovers: leftoverSheets.length > 0
    };
  };

  // CRUD handlers
  const handleAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      id: '',
      orderRef: '',
      date: today,
      customerId: '',
      items: [],
      notes: ''
    });
    setLineItems([{
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      length: 0,
      width: 0,
      qty: 0,
      unitCost: 0,
      unitSalePrice: 0
    }]);
    setIsAddModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setFormData({ ...order });
    setLineItems(order.items && order.items.length > 0 ? [...order.items] : [{
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      length: 0,
      width: 0,
      qty: 0,
      unitCost: 0,
      unitSalePrice: 0
    }]);
    setIsEditModalOpen(true);
  };

  const handleDelete = (order: Order) => {
    setCurrentOrder(order);
    setIsDeleteModalOpen(true);
  };

  const calculateItemTotals = (item: OrderItem) => {
    const totalCost = item.qty * (item.unitCost || 0);
    const totalSale = item.qty * (item.unitSalePrice || 0);
    const profit = totalSale - totalCost;
    return { totalCost, totalSale, profit };
  };

  const calculateOrderTotals = (items: OrderItem[]) => {
    let totalCost = 0;
    let totalSale = 0;
    items.forEach(item => {
      const itemTotals = calculateItemTotals(item);
      totalCost += itemTotals.totalCost;
      totalSale += itemTotals.totalSale;
    });
    const profit = totalSale - totalCost;
    return { totalCost, totalSale, profit };
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      length: 0,
      width: 0,
      qty: 0,
      unitCost: 0,
      unitSalePrice: 0
    }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof OrderItem, value: any) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(updated);
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.orderRef || !formData.customerId) {
      alert('Please fill in required fields (ID, Order Ref, Customer)');
      return;
    }

    if (lineItems.length === 0 || lineItems.some(item => !item.productId || item.qty <= 0)) {
      alert('Please add at least one valid line item with product and quantity');
      return;
    }

    const customerName = getCustomerName(formData.customerId || '');

    // Calculate totals for each item and add to items array
    const itemsWithTotals = lineItems.map(item => {
      const totals = calculateItemTotals(item);
      return {
        ...item,
        totalCost: totals.totalCost,
        totalSale: totals.totalSale,
        profit: totals.profit
      };
    });

    const orderTotals = calculateOrderTotals(itemsWithTotals);

    const newOrder: Order = {
      id: formData.id!,
      orderRef: formData.orderRef!,
      date: formData.date || new Date().toISOString().split('T')[0],
      customerId: formData.customerId!,
      customerName,
      items: itemsWithTotals,
      totalCost: orderTotals.totalCost,
      totalSale: orderTotals.totalSale,
      profit: orderTotals.profit,
      notes: formData.notes || ''
    };

    setOrders([...orders, newOrder]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.orderRef || !formData.customerId) {
      alert('Please fill in required fields (ID, Order Ref, Customer)');
      return;
    }

    if (lineItems.length === 0 || lineItems.some(item => !item.productId || item.qty <= 0)) {
      alert('Please add at least one valid line item with product and quantity');
      return;
    }

    const customerName = getCustomerName(formData.customerId || '');

    // Calculate totals for each item
    const itemsWithTotals = lineItems.map(item => {
      const totals = calculateItemTotals(item);
      return {
        ...item,
        totalCost: totals.totalCost,
        totalSale: totals.totalSale,
        profit: totals.profit
      };
    });

    const orderTotals = calculateOrderTotals(itemsWithTotals);

    const updatedOrders = orders.map(o =>
      o.id === currentOrder?.id ? {
        ...formData as Order,
        customerName,
        items: itemsWithTotals,
        totalCost: orderTotals.totalCost,
        totalSale: orderTotals.totalSale,
        profit: orderTotals.profit
      } : o
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

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleExport = () => {
    exportToExcel('SheetCuttingBusinessTemplate_Export.xlsx', {
      orders,
      customers,
      products
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Orders Management</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
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
            + Add New Order
          </button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <label htmlFor="product-filter" className="text-sm font-medium text-gray-700">
              Filter by Product:
            </label>
            <select
              id="product-filter"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Products</option>
              {productsFilter.map((productId) => (
                <option key={productId} value={productId}>
                  {getProductName(productId)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Orders</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Cost (₹)</h3>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            ₹{filteredOrders.reduce((sum, row) => sum + (row.totalCost || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Order Details</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost (₹)</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No orders found. {filterProduct !== 'all' ? 'Try changing the filter or ' : ''}Click &quot;Add New Order&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isExpanded = expandedOrders.has(order.id);
                    const itemCount = order.items?.length || 0;
                    
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              {itemCount > 0 && (
                                <button
                                  onClick={() => toggleOrderExpansion(order.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {isExpanded ? '▼' : '▶'}
                                </button>
                              )}
                              <span className="font-medium text-blue-600">{order.orderRef}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{order.date}</td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {order.customerName || getCustomerName(order.customerId)}
                            <div className="text-xs text-gray-500">{order.customerId}</div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹{(order.totalCost || 0).toFixed(2)}</td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
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
                        {isExpanded && order.items && order.items.length > 0 && (
                          <tr>
                            <td colSpan={6} className="px-2 sm:px-4 py-2 bg-gray-50">
                              <div className="ml-8">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Line Items:</h4>
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">#</th>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Dimensions (mm)</th>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Unit Cost (₹)</th>
                                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Total Cost (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item, idx) => (
                                      <tr key={item.id}>
                                        <td className="px-2 py-2 text-xs text-gray-900">{idx + 1}</td>
                                        <td className="px-2 py-2 text-xs text-gray-900">{item.productName || getProductName(item.productId)}</td>
                                        <td className="px-2 py-2 text-xs text-gray-900">{item.length}×{item.width}</td>
                                        <td className="px-2 py-2 text-xs text-gray-900">{item.qty}</td>
                                        <td className="px-2 py-2 text-xs text-gray-900">₹{(item.unitCost || 0).toFixed(2)}</td>
                                        <td className="px-2 py-2 text-xs text-gray-900">₹{(item.totalCost || 0).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              Track and manage all customer orders with complete product traceability. Each order is linked to a customer and shows which product was used, enabling full end-to-end tracking from supplier to customer.
            </p>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Order" maxWidth="4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Line Items Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
              <button
                onClick={addLineItem}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {lineItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product *</label>
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const productId = e.target.value;
                          const product = getProduct(productId);
                          if (product) {
                            updateLineItem(index, 'productId', productId);
                            updateLineItem(index, 'productName', product.name);
                            updateLineItem(index, 'length', product.length);
                            updateLineItem(index, 'width', product.width);
                            updateLineItem(index, 'unitCost', product.unitCost * product.area);
                          } else {
                            updateLineItem(index, 'productId', productId);
                          }
                        }}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Product</option>
                        {products.map(product => {
                          const stockInfo = getStockInfo(product.id);
                          return (
                            <option key={product.id} value={product.id}>
                              {product.name} {stockInfo.hasLeftovers ? '(Has Leftovers)' : stockInfo.hasStock ? '(In Stock)' : '(Out of Stock)'}
                            </option>
                          );
                        })}
                      </select>
                      {item.productId && (
                        <div className="mt-1 text-xs">
                          {(() => {
                            const stockInfo = getStockInfo(item.productId);
                            if (stockInfo.hasLeftovers) {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  {stockInfo.leftoverSheets} leftover piece(s) available
                                </span>
                              );
                            } else if (stockInfo.hasStock) {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {stockInfo.availableSheets} uncut sheet(s) available
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  Out of stock
                                </span>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Length (mm) *</label>
                      <input
                        type="number"
                        value={item.length}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width (mm) *</label>
                      <input
                        type="number"
                        value={item.width}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateLineItem(index, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit Cost (₹)</label>
                      <input
                        type="number"
                        value={item.unitCost}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Total Cost: </span>
                          <span className="font-medium">₹{calculateItemTotals(item).totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Order Totals</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Cost: </span>
                  <span className="font-bold text-orange-600">₹{calculateOrderTotals(lineItems).totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Additional notes for the entire order..."
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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Order" maxWidth="4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Line Items Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
              <button
                onClick={addLineItem}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {lineItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product *</label>
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const productId = e.target.value;
                          const product = getProduct(productId);
                          if (product) {
                            updateLineItem(index, 'productId', productId);
                            updateLineItem(index, 'productName', product.name);
                            updateLineItem(index, 'length', product.length);
                            updateLineItem(index, 'width', product.width);
                            updateLineItem(index, 'unitCost', product.unitCost * product.area);
                          } else {
                            updateLineItem(index, 'productId', productId);
                          }
                        }}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Product</option>
                        {products.map(product => {
                          const stockInfo = getStockInfo(product.id);
                          return (
                            <option key={product.id} value={product.id}>
                              {product.name} {stockInfo.hasLeftovers ? '(Has Leftovers)' : stockInfo.hasStock ? '(In Stock)' : '(Out of Stock)'}
                            </option>
                          );
                        })}
                      </select>
                      {item.productId && (
                        <div className="mt-1 text-xs">
                          {(() => {
                            const stockInfo = getStockInfo(item.productId);
                            if (stockInfo.hasLeftovers) {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  {stockInfo.leftoverSheets} leftover piece(s) available
                                </span>
                              );
                            } else if (stockInfo.hasStock) {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {stockInfo.availableSheets} uncut sheet(s) available
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  Out of stock
                                </span>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Length (mm) *</label>
                      <input
                        type="number"
                        value={item.length}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width (mm) *</label>
                      <input
                        type="number"
                        value={item.width}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateLineItem(index, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit Cost (₹)</label>
                      <input
                        type="number"
                        value={item.unitCost}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="Auto-filled"
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Total Cost: </span>
                          <span className="font-medium">₹{calculateItemTotals(item).totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Order Totals</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Cost: </span>
                  <span className="font-bold text-orange-600">₹{calculateOrderTotals(lineItems).totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Additional notes for the entire order..."
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
