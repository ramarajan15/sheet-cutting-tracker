const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Sample Categories data
const categories = [
  { id: 'CAT001', name: 'Decorative Laminates', description: 'High-quality decorative laminates for furniture and interiors' },
  { id: 'CAT002', name: 'Industrial Laminates', description: 'Durable laminates for industrial applications' },
  { id: 'CAT003', name: 'Compact Laminates', description: 'High-pressure compact laminates for heavy-duty use' },
  { id: 'CAT004', name: 'Wood Finish Laminates', description: 'Natural wood-finish laminate sheets' },
  { id: 'CAT005', name: 'Solid Color Laminates', description: 'Solid color laminate sheets for modern designs' },
  { id: 'CAT006', name: 'Plywood', description: 'Commercial and marine grade plywood sheets' },
  { id: 'CAT007', name: 'Hylam Sheets', description: 'High-pressure decorative hylam laminate sheets' },
  { id: 'CAT008', name: 'Mica Sheets', description: 'Heat-resistant mica laminate sheets' },
  { id: 'CAT009', name: 'Aluminium Sheets', description: 'Industrial aluminium sheets for various applications' },
  { id: 'CAT010', name: 'Teflon Sheets', description: 'Non-stick PTFE teflon sheets for industrial use' }
];

// Sample Products data
const products = [
  {
    id: 'PROD001',
    name: 'Premium Oak Laminate',
    categoryId: 'CAT004',
    categoryName: 'Wood Finish Laminates',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 7442.000,
    unitCost: 0.0025,
    colour: 'Oak Brown',
    weight: 15000,
    notes: 'Popular wood finish, suitable for furniture'
  },
  {
    id: 'PROD002',
    name: 'Classic Walnut Laminate',
    categoryId: 'CAT004',
    categoryName: 'Wood Finish Laminates',
    length: 2440,
    width: 1220,
    thickness: 0.8,
    area: 2976800,
    price: 6653.696,
    unitCost: 0.0028,
    colour: 'Dark Walnut',
    weight: 14000,
    notes: 'Premium walnut finish'
  },
  {
    id: 'PROD003',
    name: 'Glossy White Laminate',
    categoryId: 'CAT005',
    categoryName: 'Solid Color Laminates',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 5953.600,
    unitCost: 0.0020,
    colour: 'White',
    weight: 15000,
    notes: 'High-gloss white finish'
  },
  {
    id: 'PROD004',
    name: 'Matte Black Laminate',
    categoryId: 'CAT005',
    categoryName: 'Solid Color Laminates',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 6548.960,
    unitCost: 0.0022,
    colour: 'Black',
    weight: 15200,
    notes: 'Matte black finish for modern designs'
  },
  {
    id: 'PROD005',
    name: 'Industrial Grey Compact',
    categoryId: 'CAT003',
    categoryName: 'Compact Laminates',
    length: 3050,
    width: 1300,
    thickness: 12.0,
    area: 3965000,
    price: 213426.000,
    unitCost: 0.0045,
    colour: 'Grey',
    weight: 48000,
    notes: 'High-pressure compact laminate for heavy-duty applications'
  },
  {
    id: 'PROD006',
    name: 'Marble Effect Laminate',
    categoryId: 'CAT001',
    categoryName: 'Decorative Laminates',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 9525.760,
    unitCost: 0.0032,
    colour: 'White Marble',
    weight: 15000,
    notes: 'Realistic marble pattern for premium interiors'
  },
  // Plywood Products
  {
    id: 'PROD007',
    name: 'Commercial Plywood',
    categoryId: 'CAT006',
    categoryName: 'Plywood',
    length: 2440,
    width: 1220,
    thickness: 18.0,
    area: 2976800,
    price: 80726.880,
    unitCost: 0.0015,
    colour: 'Natural Wood',
    weight: 28000,
    notes: 'BWR grade commercial plywood for furniture'
  },
  {
    id: 'PROD008',
    name: 'Marine Plywood',
    categoryId: 'CAT006',
    categoryName: 'Plywood',
    length: 2440,
    width: 1220,
    thickness: 12.0,
    area: 2976800,
    price: 78731.136,
    unitCost: 0.0022,
    colour: 'Natural Wood',
    weight: 22000,
    notes: 'BWP grade marine plywood - waterproof'
  },
  // Hylam Sheet Products
  {
    id: 'PROD009',
    name: 'Hylam Glossy Finish',
    categoryId: 'CAT007',
    categoryName: 'Hylam Sheets',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 8339.840,
    unitCost: 0.0028,
    colour: 'High Gloss White',
    weight: 16000,
    notes: 'Premium hylam sheet with glossy finish'
  },
  {
    id: 'PROD010',
    name: 'Hylam Wood Texture',
    categoryId: 'CAT007',
    categoryName: 'Hylam Sheets',
    length: 2440,
    width: 1220,
    thickness: 0.8,
    area: 2976800,
    price: 6177.792,
    unitCost: 0.0026,
    colour: 'Oak Texture',
    weight: 14500,
    notes: 'Textured hylam with natural wood finish'
  },
  // Mica Sheet Products
  {
    id: 'PROD011',
    name: 'Standard Mica Sheet',
    categoryId: 'CAT008',
    categoryName: 'Mica Sheets',
    length: 2440,
    width: 1220,
    thickness: 1.0,
    area: 2976800,
    price: 5358.240,
    unitCost: 0.0018,
    colour: 'Beige',
    weight: 13000,
    notes: 'Heat-resistant mica laminate for kitchen applications'
  },
  {
    id: 'PROD012',
    name: 'Premium Mica Sheet',
    categoryId: 'CAT008',
    categoryName: 'Mica Sheets',
    length: 2440,
    width: 1220,
    thickness: 1.2,
    area: 2976800,
    price: 8572.416,
    unitCost: 0.0024,
    colour: 'Metallic Grey',
    weight: 14000,
    notes: 'Premium grade mica with scratch resistance'
  },
  // Aluminium Sheet Products
  {
    id: 'PROD013',
    name: 'Aluminium Sheet 3mm',
    categoryId: 'CAT009',
    categoryName: 'Aluminium Sheets',
    length: 2440,
    width: 1220,
    thickness: 3.0,
    area: 2976800,
    price: 31256.400,
    unitCost: 0.0035,
    colour: 'Natural Silver',
    weight: 24000,
    notes: '6061 grade aluminium for industrial use'
  },
  {
    id: 'PROD014',
    name: 'Aluminium Sheet 5mm',
    categoryId: 'CAT009',
    categoryName: 'Aluminium Sheets',
    length: 2440,
    width: 1220,
    thickness: 5.0,
    area: 2976800,
    price: 71606.400,
    unitCost: 0.0048,
    colour: 'Natural Silver',
    weight: 40000,
    notes: 'Heavy-duty aluminium sheet for construction'
  },
  // Teflon Sheet Products
  {
    id: 'PROD015',
    name: 'Teflon PTFE Sheet 2mm',
    categoryId: 'CAT010',
    categoryName: 'Teflon Sheets',
    length: 2000,
    width: 1000,
    thickness: 2.0,
    area: 2000000,
    price: 22000.000,
    unitCost: 0.0055,
    colour: 'White',
    weight: 8000,
    notes: 'Virgin PTFE teflon sheet for chemical resistance'
  },
  {
    id: 'PROD016',
    name: 'Teflon PTFE Sheet 5mm',
    categoryId: 'CAT010',
    categoryName: 'Teflon Sheets',
    length: 2000,
    width: 1000,
    thickness: 5.0,
    area: 2000000,
    price: 82000.000,
    unitCost: 0.0082,
    colour: 'White',
    weight: 18000,
    notes: 'Industrial grade teflon for high-temperature applications'
  }
];

// Sample Customers data
const customers = [
  {
    id: 'CUST001',
    name: 'ABC Furniture Works',
    email: 'contact@abcfurniture.com',
    phone: '+91-98765-43210',
    address: '123 Industrial Area, Mumbai, Maharashtra',
    notes: 'Regular customer, prefers hylam and plywood'
  },
  {
    id: 'CUST002',
    name: 'XYZ Interior Designers',
    email: 'info@xyzinteriors.com',
    phone: '+91-98765-43211',
    address: '456 Design Plaza, Bangalore, Karnataka',
    notes: 'Premium client, orders decorative laminates'
  },
  {
    id: 'CUST003',
    name: 'Modern Kitchen Solutions',
    email: 'sales@modernkitchen.com',
    phone: '+91-98765-43212',
    address: '789 Kitchen Hub, Delhi',
    notes: 'Bulk orders for mica sheets and laminates'
  },
  {
    id: 'CUST004',
    name: 'Industrial Fabricators Ltd',
    email: 'procurement@indfab.com',
    phone: '+91-98765-43213',
    address: '321 Factory Road, Chennai, Tamil Nadu',
    notes: 'Requires aluminium and teflon sheets'
  }
];

// Sample Factories data
const factories = [
  {
    id: 'FAC001',
    name: 'Premium Laminates India',
    location: 'Mumbai, Maharashtra',
    contact: 'Rajesh Kumar',
    email: 'rajesh@premiumlam.com',
    phone: '+91-22-2345-6789',
    materials: 'Decorative Laminates, Wood Finish Laminates, Hylam Sheets',
    notes: 'Leading supplier of decorative laminates'
  },
  {
    id: 'FAC002',
    name: 'Plywood Industries',
    location: 'Yamunanagar, Haryana',
    contact: 'Suresh Sharma',
    email: 'suresh@plywoodind.com',
    phone: '+91-17-3245-6789',
    materials: 'Commercial Plywood, Marine Plywood',
    notes: 'BWR and BWP grade plywood manufacturer'
  },
  {
    id: 'FAC003',
    name: 'Mica Tech Solutions',
    location: 'Ahmedabad, Gujarat',
    contact: 'Priya Patel',
    email: 'priya@micatech.com',
    phone: '+91-79-2345-6789',
    materials: 'Mica Sheets, Heat-resistant Laminates',
    notes: 'Specialized in mica and heat-resistant materials'
  },
  {
    id: 'FAC004',
    name: 'Metro Aluminium Works',
    location: 'Pune, Maharashtra',
    contact: 'Amit Singh',
    email: 'amit@metroalu.com',
    phone: '+91-20-2345-6789',
    materials: 'Aluminium Sheets, Metal Sheets',
    notes: 'Industrial grade aluminium supplier'
  },
  {
    id: 'FAC005',
    name: 'Teflon Industries India',
    location: 'Coimbatore, Tamil Nadu',
    contact: 'Deepak Menon',
    email: 'deepak@teflonind.com',
    phone: '+91-42-2345-6789',
    materials: 'PTFE Teflon Sheets, Industrial Polymers',
    notes: 'Specialized teflon and polymer products'
  }
];

// Sample Purchases data
const purchases = [
  {
    id: 'PUR001',
    date: '2024-01-15',
    factoryId: 'FAC001',
    factoryName: 'Premium Laminates India',
    productId: 'PROD009',
    productName: 'Hylam Glossy Finish',
    size: '2440x1220',
    thickness: '1.0mm',
    qty: 50,
    unitCost: 8339.84,
    totalCost: 416992.00,
    batchRef: 'HYL-2024-001',
    notes: 'Premium hylam sheets for furniture project'
  },
  {
    id: 'PUR002',
    date: '2024-01-20',
    factoryId: 'FAC002',
    factoryName: 'Plywood Industries',
    productId: 'PROD007',
    productName: 'Commercial Plywood',
    size: '2440x1220',
    thickness: '18.0mm',
    qty: 30,
    unitCost: 4465.20,
    totalCost: 133956.00,
    batchRef: 'PLY-2024-001',
    notes: 'BWR grade commercial plywood'
  },
  {
    id: 'PUR003',
    date: '2024-01-25',
    factoryId: 'FAC003',
    factoryName: 'Mica Tech Solutions',
    productId: 'PROD011',
    productName: 'Standard Mica Sheet',
    size: '2440x1220',
    thickness: '1.0mm',
    qty: 40,
    unitCost: 5359.04,
    totalCost: 214361.60,
    batchRef: 'MIC-2024-001',
    notes: 'Heat-resistant mica for kitchen applications'
  },
  {
    id: 'PUR004',
    date: '2024-02-01',
    factoryId: 'FAC004',
    factoryName: 'Metro Aluminium Works',
    productId: 'PROD013',
    productName: 'Aluminium Sheet 3mm',
    size: '2440x1220',
    thickness: '3.0mm',
    qty: 25,
    unitCost: 10418.80,
    totalCost: 260470.00,
    batchRef: 'ALU-2024-001',
    notes: '6061 grade aluminium sheets'
  },
  {
    id: 'PUR005',
    date: '2024-02-05',
    factoryId: 'FAC005',
    factoryName: 'Teflon Industries India',
    productId: 'PROD015',
    productName: 'Teflon PTFE Sheet 2mm',
    size: '2000x1000',
    thickness: '2.0mm',
    qty: 20,
    unitCost: 11000.00,
    totalCost: 220000.00,
    batchRef: 'TEF-2024-001',
    notes: 'Virgin PTFE teflon sheets'
  },
  {
    id: 'PUR006',
    date: '2024-02-10',
    factoryId: 'FAC001',
    factoryName: 'Premium Laminates India',
    productId: 'PROD010',
    productName: 'Hylam Wood Texture',
    size: '2440x1220',
    thickness: '0.8mm',
    qty: 35,
    unitCost: 7739.68,
    totalCost: 270888.80,
    batchRef: 'HYL-2024-002',
    notes: 'Textured hylam with oak finish'
  },
  {
    id: 'PUR007',
    date: '2024-02-15',
    factoryId: 'FAC002',
    factoryName: 'Plywood Industries',
    productId: 'PROD008',
    productName: 'Marine Plywood',
    size: '2440x1220',
    thickness: '12.0mm',
    qty: 25,
    unitCost: 6548.96,
    totalCost: 163724.00,
    batchRef: 'PLY-2024-002',
    notes: 'BWP grade waterproof plywood'
  }
];

// Sample Stock data
const stock = [
  {
    id: 'STK001',
    purchaseId: 'PUR001',
    factoryId: 'FAC001',
    productId: 'PROD009',
    productName: 'Hylam Glossy Finish',
    size: '2440x1220',
    thickness: '1.0mm',
    dateReceived: '2024-01-15',
    batchRef: 'HYL-2024-001',
    status: 'available',
    notes: 'Available for orders'
  },
  {
    id: 'STK002',
    purchaseId: 'PUR001',
    factoryId: 'FAC001',
    productId: 'PROD009',
    productName: 'Hylam Glossy Finish',
    size: '2440x1220',
    thickness: '1.0mm',
    dateReceived: '2024-01-15',
    batchRef: 'HYL-2024-001',
    status: 'used',
    notes: 'Used for ORD001'
  },
  {
    id: 'STK003',
    purchaseId: 'PUR002',
    factoryId: 'FAC002',
    productId: 'PROD007',
    productName: 'Commercial Plywood',
    size: '2440x1220',
    thickness: '18.0mm',
    dateReceived: '2024-01-20',
    batchRef: 'PLY-2024-001',
    status: 'available',
    notes: 'BWR grade plywood in stock'
  },
  {
    id: 'STK004',
    purchaseId: 'PUR002',
    factoryId: 'FAC002',
    productId: 'PROD007',
    productName: 'Commercial Plywood',
    size: '2440x1220',
    thickness: '18.0mm',
    dateReceived: '2024-01-20',
    batchRef: 'PLY-2024-001',
    status: 'used',
    notes: 'Used for ORD002'
  },
  {
    id: 'STK005',
    purchaseId: 'PUR003',
    factoryId: 'FAC003',
    productId: 'PROD011',
    productName: 'Standard Mica Sheet',
    size: '2440x1220',
    thickness: '1.0mm',
    dateReceived: '2024-01-25',
    batchRef: 'MIC-2024-001',
    status: 'available',
    notes: 'Mica sheets for kitchen use'
  },
  {
    id: 'STK006',
    purchaseId: 'PUR003',
    factoryId: 'FAC003',
    productId: 'PROD011',
    productName: 'Standard Mica Sheet',
    size: '2440x1220',
    thickness: '1.0mm',
    dateReceived: '2024-01-25',
    batchRef: 'MIC-2024-001',
    status: 'used',
    notes: 'Used for ORD003'
  },
  {
    id: 'STK007',
    purchaseId: 'PUR004',
    factoryId: 'FAC004',
    productId: 'PROD013',
    productName: 'Aluminium Sheet 3mm',
    size: '2440x1220',
    thickness: '3.0mm',
    dateReceived: '2024-02-01',
    batchRef: 'ALU-2024-001',
    status: 'available',
    notes: 'Industrial grade aluminium'
  },
  {
    id: 'STK008',
    purchaseId: 'PUR004',
    factoryId: 'FAC004',
    productId: 'PROD013',
    productName: 'Aluminium Sheet 3mm',
    size: '2440x1220',
    thickness: '3.0mm',
    dateReceived: '2024-02-01',
    batchRef: 'ALU-2024-001',
    status: 'used',
    notes: 'Used for ORD004'
  },
  {
    id: 'STK009',
    purchaseId: 'PUR005',
    factoryId: 'FAC005',
    productId: 'PROD015',
    productName: 'Teflon PTFE Sheet 2mm',
    size: '2000x1000',
    thickness: '2.0mm',
    dateReceived: '2024-02-05',
    batchRef: 'TEF-2024-001',
    status: 'available',
    notes: 'Virgin PTFE teflon'
  },
  {
    id: 'STK010',
    purchaseId: 'PUR005',
    factoryId: 'FAC005',
    productId: 'PROD015',
    productName: 'Teflon PTFE Sheet 2mm',
    size: '2000x1000',
    thickness: '2.0mm',
    dateReceived: '2024-02-05',
    batchRef: 'TEF-2024-001',
    status: 'used',
    notes: 'Used for ORD005'
  }
];

// Sample Orders data with multi-item support
const orders = [
  {
    id: 'ORD001',
    orderRef: 'ORD001',
    date: '2024-02-01',
    customerId: 'CUST001',
    customerName: 'ABC Furniture Works',
    productId: 'PROD009',
    productName: 'Hylam Glossy Finish',
    pieceSize: '1200x600',
    qty: 10,
    unitCost: 8339.84,
    unitSalePrice: 11000.00,
    totalCost: 83398.40,
    totalSale: 110000.00,
    profit: 26601.60,
    notes: 'Cabinet doors for premium furniture'
  },
  {
    id: 'ORD002',
    orderRef: 'ORD002',
    date: '2024-02-05',
    customerId: 'CUST002',
    customerName: 'XYZ Interior Designers',
    productId: 'PROD007',
    productName: 'Commercial Plywood',
    pieceSize: '1220x800',
    qty: 15,
    unitCost: 4465.20,
    unitSalePrice: 6000.00,
    totalCost: 66978.00,
    totalSale: 90000.00,
    profit: 23022.00,
    notes: 'Plywood for interior partitions'
  },
  {
    id: 'ORD003',
    orderRef: 'ORD003',
    date: '2024-02-10',
    customerId: 'CUST003',
    customerName: 'Modern Kitchen Solutions',
    productId: 'PROD011',
    productName: 'Standard Mica Sheet',
    pieceSize: '900x600',
    qty: 20,
    unitCost: 5359.04,
    unitSalePrice: 7200.00,
    totalCost: 107180.80,
    totalSale: 144000.00,
    profit: 36819.20,
    notes: 'Kitchen counter backsplash'
  },
  {
    id: 'ORD004',
    orderRef: 'ORD004',
    date: '2024-02-15',
    customerId: 'CUST004',
    customerName: 'Industrial Fabricators Ltd',
    productId: 'PROD013',
    productName: 'Aluminium Sheet 3mm',
    pieceSize: '1000x500',
    qty: 12,
    unitCost: 10418.80,
    unitSalePrice: 14000.00,
    totalCost: 125025.60,
    totalSale: 168000.00,
    profit: 42974.40,
    notes: 'Industrial panels for machinery'
  },
  {
    id: 'ORD005',
    orderRef: 'ORD005',
    date: '2024-02-20',
    customerId: 'CUST004',
    customerName: 'Industrial Fabricators Ltd',
    productId: 'PROD015',
    productName: 'Teflon PTFE Sheet 2mm',
    pieceSize: '800x500',
    qty: 8,
    unitCost: 11000.00,
    unitSalePrice: 15000.00,
    totalCost: 88000.00,
    totalSale: 120000.00,
    profit: 32000.00,
    notes: 'Chemical resistant lining'
  }
];

// Path to the Excel file
const excelFilePath = path.join(__dirname, '../public/SheetCuttingBusinessTemplate.xlsx');

try {
  // Read existing workbook
  const workbook = XLSX.readFile(excelFilePath);
  
  // Add Categories sheet
  const categoriesSheet = XLSX.utils.json_to_sheet(categories);
  if (workbook.SheetNames.includes('Categories')) {
    // Replace existing sheet
    workbook.Sheets['Categories'] = categoriesSheet;
  } else {
    // Add new sheet
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');
  }
  
  // Add Products sheet
  const productsSheet = XLSX.utils.json_to_sheet(products);
  if (workbook.SheetNames.includes('Products')) {
    // Replace existing sheet
    workbook.Sheets['Products'] = productsSheet;
  } else {
    // Add new sheet
    XLSX.utils.book_append_sheet(workbook, productsSheet, 'Products');
  }
  
  // Add Customers sheet
  const customersSheet = XLSX.utils.json_to_sheet(customers);
  if (workbook.SheetNames.includes('Customers')) {
    workbook.Sheets['Customers'] = customersSheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customers');
  }
  
  // Add Factories sheet
  const factoriesSheet = XLSX.utils.json_to_sheet(factories);
  if (workbook.SheetNames.includes('Factories')) {
    workbook.Sheets['Factories'] = factoriesSheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, factoriesSheet, 'Factories');
  }
  
  // Add Purchases sheet
  const purchasesSheet = XLSX.utils.json_to_sheet(purchases);
  if (workbook.SheetNames.includes('Purchases')) {
    workbook.Sheets['Purchases'] = purchasesSheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, purchasesSheet, 'Purchases');
  }
  
  // Add Stock sheet
  const stockSheet = XLSX.utils.json_to_sheet(stock);
  if (workbook.SheetNames.includes('Stock')) {
    workbook.Sheets['Stock'] = stockSheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock');
  }
  
  // Add Orders sheet
  const ordersSheet = XLSX.utils.json_to_sheet(orders);
  if (workbook.SheetNames.includes('Orders')) {
    workbook.Sheets['Orders'] = ordersSheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders');
  }
  
  // Write workbook back to file
  XLSX.writeFile(workbook, excelFilePath);
  
  console.log('✅ Successfully added all sample data sheets to Excel file');
  console.log(`   - Added ${categories.length} categories`);
  console.log(`   - Added ${products.length} products`);
  console.log(`   - Added ${customers.length} customers`);
  console.log(`   - Added ${factories.length} factories`);
  console.log(`   - Added ${purchases.length} purchases`);
  console.log(`   - Added ${stock.length} stock items`);
  console.log(`   - Added ${orders.length} orders`);
} catch (error) {
  console.error('❌ Error updating Excel file:', error.message);
  process.exit(1);
}
