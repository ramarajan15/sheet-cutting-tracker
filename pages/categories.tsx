import React, { useEffect, useState } from 'react';
import { readCategories, Category, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Category>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Category>>({
    id: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await readCategories('SheetCuttingBusinessTemplate.xlsx');
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading categories data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtering and sorting
  const filteredCategories = categories
    .filter(category => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        category.id.toLowerCase().includes(search) ||
        category.name.toLowerCase().includes(search) ||
        (category.description && category.description.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CRUD handlers
  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({ ...category });
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const newCategory: Category = {
      id: formData.id,
      name: formData.name,
      description: formData.description || ''
    };

    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill in required fields (ID and Name)');
      return;
    }

    const updatedCategories = categories.map(c =>
      c.id === currentCategory?.id ? { ...formData as Category } : c
    );

    setCategories(updatedCategories);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentCategory) {
      setCategories(categories.filter(c => c.id !== currentCategory.id));
      setIsDeleteModalOpen(false);
      setCurrentCategory(null);
    }
  };

  const handleExport = () => {
    exportToExcel('Categories_Export.xlsx', {
      categories
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading categories data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Category Management</h1>
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
            + Add New Category
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide">Total Categories</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">{categories.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-green-600 uppercase tracking-wide">Filtered Results</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-2">{filteredCategories.length}</p>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by ID, name, or description..."
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Categories</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage product categories for organization and filtering
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  Category ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('description')}
                >
                  Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {category.description || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No categories found. {searchTerm && "Try adjusting your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              Category data is loaded from the &apos;Categories&apos; sheet in the Excel file. Categories are used to organize products and help with filtering and reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Category" maxWidth="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID *
                <span className="text-xs text-gray-500 font-normal ml-2">(e.g., CAT001)</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CAT001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Laminate Sheets"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of the category..."
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
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Category" maxWidth="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Category" maxWidth="md">
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete category &quot;<strong>{currentCategory?.name}</strong>&quot;?
          </p>
          <p className="text-sm text-red-600 mb-6">
            Warning: This action cannot be undone. Products associated with this category may be affected.
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
