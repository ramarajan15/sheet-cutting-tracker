const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Sample Categories data
const categories = [
  { id: 'CAT001', name: 'Decorative Laminates', description: 'High-quality decorative laminates for furniture and interiors' },
  { id: 'CAT002', name: 'Industrial Laminates', description: 'Durable laminates for industrial applications' },
  { id: 'CAT003', name: 'Compact Laminates', description: 'High-pressure compact laminates for heavy-duty use' },
  { id: 'CAT004', name: 'Wood Finish Laminates', description: 'Natural wood-finish laminate sheets' },
  { id: 'CAT005', name: 'Solid Color Laminates', description: 'Solid color laminate sheets for modern designs' }
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
    unitCost: 0.0032,
    colour: 'White Marble',
    weight: 15000,
    notes: 'Realistic marble pattern for premium interiors'
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
  
  // Write workbook back to file
  XLSX.writeFile(workbook, excelFilePath);
  
  console.log('✅ Successfully added Categories and Products sheets to Excel file');
  console.log(`   - Added ${categories.length} categories`);
  console.log(`   - Added ${products.length} products`);
} catch (error) {
  console.error('❌ Error updating Excel file:', error.message);
  process.exit(1);
}
