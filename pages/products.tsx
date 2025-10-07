import React, { useEffect, useState } from 'react';
import { readProducts, readCategories, Product, Category, exportToExcel } from '@/utils/excelUtils';
import Modal from '@/components/Modal';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Product>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    name: '',
    categoryId: '',
    length: 0,
    width: 0,
    thickness: 0,
    area: 0,
    price: 0,
    unitCost: 0,
    colour: '',
    weight: 0,
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await readProducts('SheetCuttingBusinessTemplate.xlsx');
        const categoriesData = await readCategories('SheetCuttingBusinessTemplate.xlsx');
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-calculate area when dimensions change
  useEffect(() => {
    if (formData.length && formData.width) {
      const area = formData.length * formData.width;
      setFormData(prev => ({ ...prev, area }));
    }
  }, [formData.length, formData.width]);

  // Auto-calculate unit cost when price or dimensions change
  useEffect(() => {
    if (formData.price && formData.length && formData.width && formData.thickness) {
      const volume = formData.length * formData.width * formData.thickness;
      const unitCost = formData.price / volume;
      setFormData(prev => ({ ...prev, unitCost }));
    }
  }, [formData.price, formData.length, formData.width, formData.thickness]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Filtering and sorting
  const filteredProducts = products
    .filter(product => {
      if (filterCategory !== 'all' && product.categoryId !== filterCategory) {
        return false;
      }
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        product.id.toLowerCase().includes(search) ||
        product.name.toLowerCase().includes(search) ||
        getCategoryName(product.categoryId).toLowerCase().includes(search) ||
        (product.colour && product.colour.toLowerCase().includes(search))
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

  const handleSort = (field: keyof Product) => {
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
      categoryId: '',
      length: 0,
      width: 0,
      thickness: 0,
      area: 0,
      price: 0,
      unitCost: 0,
      colour: '',
      weight: 0,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({ ...product });
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.id || !formData.name || !formData.categoryId) {
      alert('Please fill in required fields (ID, Name, and Category)');
      return;
    }

    if (!formData.length || !formData.width || !formData.thickness) {
      alert('Please fill in all size dimensions (Length, Width, Thickness)');
      return;
    }

    const categoryName = getCategoryName(formData.categoryId);
    const newProduct: Product = {
      id: formData.id,
      name: formData.name,
      categoryId: formData.categoryId,
      categoryName,
      length: Number(formData.length),
      width: Number(formData.width),
      thickness: Number(formData.thickness),
      area: Number(formData.area),
      price: Number(formData.price || 0),
      unitCost: Number(formData.unitCost || 0),
      colour: formData.colour || '',
      weight: Number(formData.weight || 0),
      notes: formData.notes || ''
    };

    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.name || !formData.categoryId) {
      alert('Please fill in required fields (ID, Name, and Category)');
      return;
    }

    if (!formData.length || !formData.width || !formData.thickness) {
      alert('Please fill in all size dimensions (Length, Width, Thickness)');
      return;
    }

    const categoryName = getCategoryName(formData.categoryId);
    const updatedProduct: Product = {
      id: formData.id,
      name: formData.name,
      categoryId: formData.categoryId,
      categoryName,
      length: Number(formData.length),
      width: Number(formData.width),
      thickness: Number(formData.thickness),
      area: Number(formData.area),
      price: Number(formData.price || 0),
      unitCost: Number(formData.unitCost || 0),
      colour: formData.colour || '',
      weight: Number(formData.weight || 0),
      notes: formData.notes || ''
    };

    const updatedProducts = products.map(p =>
      p.id === currentProduct?.id ? updatedProduct : p
    );

    setProducts(updatedProducts);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentProduct) {
      setProducts(products.filter(p => p.id !== currentProduct.id));
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleExport = () => {
    exportToExcel('Products_Export.xlsx', {
      products,
      categories
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading products data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
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
            + Add New Product
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-blue-600 uppercase tracking-wide">Total Products</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-green-600 uppercase tracking-wide">Categories</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-2">{categories.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-purple-600 uppercase tracking-wide">Filtered Results</h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-2">{filteredProducts.length}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-orange-600 uppercase tracking-wide">Avg Unit Cost</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-900 mt-2">
            ₹{products.length > 0 ? (products.reduce((sum, p) => sum + p.unitCost, 0) / products.length).toFixed(4) : '0.0000'}
          </p>
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
              placeholder="Search by ID, name, category, or colour..."
            />
          </div>
          <div className="sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Products</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage product catalog with specifications and pricing
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
                  Product ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('categoryId')}
                >
                  Category {sortField === 'categoryId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size (L×W×T mm)
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('area')}
                >
                  Area (mm²) {sortField === 'area' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  Price (₹) {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('unitCost')}
                >
                  Unit Cost (₹/mm³) {sortField === 'unitCost' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('colour')}
                >
                  Colour {sortField === 'colour' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('weight')}
                >
                  Weight (g) {sortField === 'weight' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.length}×{product.width}×{product.thickness}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.area.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(product.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(product.unitCost || 0).toFixed(6)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.colour || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.weight || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No products found. {searchTerm && "Try adjusting your search or filters."}
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
              Product data is loaded from the &apos;Products&apos; sheet in the Excel file. All dimensions are in millimeters (mm), area is calculated automatically in mm². Price is the cost of the whole product in Indian Rupees (₹), and unit cost is automatically calculated as price / (length × width × thickness) per cubic mm.
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product" maxWidth="2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID *
                <span className="text-xs text-gray-500 font-normal ml-2">(e.g., PROD001)</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., PROD001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Premium Oak Laminate"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dimensions *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2440"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (mm)
                </label>
                <input
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1220"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input
                  type="number"
                  value={formData.thickness || ''}
                  onChange={(e) => setFormData({ ...formData, thickness: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1.0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (mm²)
              <span className="text-xs text-gray-500 font-normal ml-2">(Auto-calculated: Length × Width)</span>
            </label>
            <input
              type="number"
              value={formData.area || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
                <span className="text-xs text-gray-500 font-normal ml-2">(Whole product price)</span>
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost (₹/mm³)
                <span className="text-xs text-gray-500 font-normal ml-2">(Auto-calculated)</span>
              </label>
              <input
                type="number"
                value={formData.unitCost || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colour</label>
              <input
                type="text"
                value={formData.colour}
                onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Oak Brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 15000"
                min="0"
                step="0.01"
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
              placeholder="Additional product information..."
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
              Add Product
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product" maxWidth="2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dimensions *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (mm)
                </label>
                <input
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input
                  type="number"
                  value={formData.thickness || ''}
                  onChange={(e) => setFormData({ ...formData, thickness: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (mm²)
              <span className="text-xs text-gray-500 font-normal ml-2">(Auto-calculated: Length × Width)</span>
            </label>
            <input
              type="number"
              value={formData.area || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
                <span className="text-xs text-gray-500 font-normal ml-2">(Whole product price)</span>
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost (₹/mm³)
                <span className="text-xs text-gray-500 font-normal ml-2">(Auto-calculated)</span>
              </label>
              <input
                type="number"
                value={formData.unitCost || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colour</label>
              <input
                type="text"
                value={formData.colour}
                onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Product" maxWidth="md">
        <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete product &quot;<strong>{currentProduct?.name}</strong>&quot;?
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
