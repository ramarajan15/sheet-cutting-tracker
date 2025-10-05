import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { readExcelFile, SheetData, calculateTotalArea, calculateTotalProfit, getStockByMaterial } from '@/utils/excelUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [data, setData] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalArea, setTotalArea] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [materialData, setMaterialData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const excelData = await readExcelFile('SheetCuttingBusinessTemplate.xlsx');
        setData(excelData);
        
        // Calculate statistics
        setTotalArea(calculateTotalArea(excelData));
        setTotalProfit(calculateTotalProfit(excelData));
        
        // Prepare material data for pie chart
        const stockByMaterial = getStockByMaterial(excelData);
        const materialChartData = Object.entries(stockByMaterial).map(([name, value]) => ({
          name,
          value: Math.round(value * 100) / 100,
        }));
        setMaterialData(materialChartData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Area Used</h3>
          <p className="text-3xl font-bold text-green-600">{totalArea.toFixed(2)} m²</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Profit</h3>
          <p className="text-3xl font-bold text-purple-600">₹{totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Material Usage Distribution</h2>
          {materialData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}m²`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Orders by Material Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Orders by Material</h2>
          {materialData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Area (m²)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Customer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.Material}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row['Order Ref']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{row.Profit?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
