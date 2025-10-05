import React, { useEffect, useState } from 'react';
import { readFactories, readPurchases, Factory, Purchase, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Factories() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFactory, setCurrentFactory] = useState<Factory | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Factory>>({
    id: '',
    name: '',
    location: '',
    contact: '',
    email: '',
    phone: '',
    materials: [],
    notes: ''
  });

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

  // CRUD handlers
  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      location: '',
      contact: '',
      email: '',
      phone: '',
      materials: [],
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (factory: Factory) => {
    setCurrentFactory(factory);
    setFormData({ ...factory });
    setIsEditModalOpen(true);
  };

  const handleDelete = (factory: Factory) => {
    setCurrentFactory(factory);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const newFactory: Factory = {
      id: formData.id,
      name: formData.name,
      location: formData.location || '',
      contact: formData.contact || '',
      email: formData.email || '',
      phone: formData.phone || '',
      materials: formData.materials || [],
      notes: formData.notes || ''
    };

    setFactories([...factories, newFactory]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const updatedFactories = factories.map(f =>
      f.id === currentFactory?.id ? { ...formData as Factory } : f
    );

    setFactories(updatedFactories);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentFactory) {
      setFactories(factories.filter(f => f.id !== currentFactory.id));
      setIsDeleteModalOpen(false);
      setCurrentFactory(null);
    }
  };

  const handleExport = () => {
    exportToExcel('SheetCuttingBusinessTemplate_Export.xlsx', {
      factories,
      purchases
    });
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
        <div className="flex gap-2">
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
            + Add New Factory
          </button>
        </div>
      </div>
      
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(factory)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(factory)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedFactory(selectedFactory === factory.id ? null : factory.id)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {selectedFactory === factory.id ? 'Hide' : 'View'} Purchases
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

      {/* Add Factory Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Factory" maxWidth="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factory ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., FAC001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factory Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Steel Works Ltd"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., New York, USA"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="factory@example.com"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contact name"
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
              Add Factory
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Factory Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Factory" maxWidth="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factory ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factory Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Factory" maxWidth="md">
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete factory &quot;<strong>{currentFactory?.name}</strong>&quot;?
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
