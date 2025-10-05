# Sheet Cutting Tracker

A Next.js web application for managing and tracking sheet cutting operations for your business.

## Features

- **Dashboard**: View summary statistics and charts for your sheet cutting operations
- **Stock Management**: Track material inventory and usage with purchase and factory traceability
- **Orders Management**: Manage customer orders and cutting jobs with sheet-to-factory traceability
- **Leftovers Management**: Track and manage leftover pieces linked to parent sheets
- **Customer Management**: Complete customer profiles with full order history and CRUD operations
- **Factory/Supplier Management**: Track suppliers and materials they provide with full CRUD operations
- **Purchase Management**: Incoming stock tracking with date, factory, material, size, qty, cost, and batch reference with CRUD operations
- **Sheet Cutting Visualizer**: Visualize and optimize sheet cutting layouts with manual and auto-arrangement
- **End-to-End Material Traceability**: Full supply chain tracking from factory purchase to customer order
- **CRUD Operations**: Create, Read, Update, and Delete functionality for Factories, Purchases, Customers, and Orders
- **Excel Export**: Export all data to Excel file for offline use and backup

## Units and Measurements

This application uses consistent units throughout:

- **Dimensions**: All length, width, breadth, and size measurements are in **millimeters (mm)**
- **Currency**: All cost, price, and profit values are in **Indian Rupees (₹)**

These units are clearly indicated in all forms, tables, and UI labels throughout the application.

## Technology Stack

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **SheetJS (xlsx)**: Excel file reading/writing
- **Recharts**: Charting library for data visualization

## Data Storage

This application uses an Excel file (`SheetCuttingBusinessTemplate.xlsx`) stored in the `/public` folder as the main data store. The Excel file contains multiple sheets for different data types:

- **Orders**: Order data (legacy format for backward compatibility)
- **Customers**: Customer profiles and contact information
- **Factories**: Supplier/factory profiles and materials supplied
- **Purchases**: Incoming stock purchases with factory, date, material, size, qty, cost, and batch reference
- **Stock**: Stock sheet inventory with purchase and factory links
- **Orders** (enhanced): Orders with customer and sheet traceability
- **Leftovers**: Leftover pieces linked to parent sheets with factory information

### Material Traceability

The application provides full end-to-end material traceability:

1. **Purchase → Factory**: Each purchase is linked to a source factory
2. **Stock Sheet → Purchase**: Each stock sheet is linked to a purchase (and thus to a factory)
3. **Order → Stock Sheet**: Each order is linked to the sheet(s) used
4. **Leftover → Parent Sheet**: Each leftover piece is linked to its parent sheet
5. **Complete Chain**: You can trace any order back to the original factory and purchase batch

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ramarajan15/sheet-cutting-tracker.git
cd sheet-cutting-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
sheet-cutting-tracker/
├── pages/                 # Next.js pages
│   ├── index.tsx         # Home page
│   ├── dashboard.tsx     # Dashboard with charts
│   ├── stock.tsx         # Stock management
│   ├── orders.tsx        # Orders management
│   ├── leftovers.tsx     # Leftovers management
│   ├── customers.tsx     # Customer profiles and order history
│   ├── factories.tsx     # Factory/supplier profiles
│   ├── purchases.tsx     # Purchase management
│   └── visualizer.tsx    # Sheet cutting visualizer
├── components/           # React components
│   ├── Layout.tsx        # Main layout wrapper
│   └── Navigation.tsx    # Navigation menu
├── utils/                # Utility functions
│   └── excelUtils.ts     # Excel file operations and data interfaces
├── public/               # Static files
│   └── SheetCuttingBusinessTemplate.xlsx  # Data file
└── styles/               # CSS styles
    └── globals.css       # Global styles
```

## Deployment to Vercel

This application is ready to be deployed to Vercel with zero configuration.

### Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy with Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Vercel will automatically detect Next.js and configure the build settings.

## Using CRUD Features

The application provides full Create, Read, Update, and Delete (CRUD) functionality for managing your business data.

### Managing Factories (Suppliers)

Navigate to `/factories` to manage your supplier/factory information:

1. **Add New Factory**: Click the "Add New Factory" button in the top-right corner
   - Fill in required fields: Factory ID and Name
   - Optional fields: Location, Email, Phone, Contact Person, and Notes
   - Click "Add Factory" to save

2. **Edit Factory**: Click "Edit" next to any factory in the table
   - Modify any fields (ID is locked)
   - Click "Save Changes" to update

3. **Delete Factory**: Click "Delete" next to any factory
   - Confirm deletion in the popup modal
   - Warning: This action cannot be undone

4. **Export Data**: Click "Export to Excel" to download current factory and purchase data

### Managing Purchases

Navigate to `/purchases` to manage incoming stock purchases:

1. **Add New Purchase**: Click the "Add New Purchase" button
   - Required fields: Purchase ID, Factory, and Material
   - Optional fields: Date, Size (in mm), Thickness (in mm), Quantity, Unit Cost (in ₹), Batch Reference, and Notes
   - Total Cost is automatically calculated from Quantity × Unit Cost
   - Click "Add Purchase" to save

2. **Edit Purchase**: Click "Edit" next to any purchase in the table
   - Modify any fields (ID is locked)
   - Total Cost updates automatically
   - Click "Save Changes" to update

3. **Delete Purchase**: Click "Delete" next to any purchase
   - Confirm deletion in the popup modal

4. **Filter and Export**: Use the filter dropdowns to narrow down purchases by factory or material, then export to Excel

### Managing Customers

Navigate to `/customers` to manage customer profiles:

1. **Add New Customer**: Click the "Add New Customer" button
   - Required fields: Customer ID and Name
   - Optional fields: Email, Phone, Address, and Notes
   - Click "Add Customer" to save

2. **Edit Customer**: Click "Edit" next to any customer in the table
   - Modify any fields (ID is locked)
   - Click "Save Changes" to update

3. **Delete Customer**: Click "Delete" next to any customer
   - Confirm deletion in the popup modal

4. **View Order History**: Click "View Orders" to see all orders for a specific customer

5. **Export Data**: Click "Export to Excel" to download current customer and order data

### Managing Orders

Navigate to `/orders` to manage customer orders:

1. **Add New Order**: Click the "Add New Order" button
   - Required fields: Order ID, Order Ref, Customer, and Material
   - Optional fields: Date, Piece Size (in mm), Quantity, Unit Cost (in ₹), Unit Sale Price (in ₹), and Notes
   - Profit is automatically calculated from (Quantity × Unit Sale Price) - (Quantity × Unit Cost)
   - Click "Add Order" to save

2. **Edit Order**: Click "Edit" next to any order in the table
   - Modify any fields (ID is locked)
   - Profit updates automatically
   - Click "Save Changes" to update

3. **Delete Order**: Click "Delete" next to any order
   - Confirm deletion in the popup modal

4. **Filter Orders**: Use the material filter dropdown to narrow down orders
   - Summary cards update automatically to reflect filtered data

5. **Export Data**: Click "Export to Excel" to download current order and customer data

### Excel Export Feature

All CRUD pages include an "Export to Excel" button that allows you to:

- Download current in-memory data as an Excel file
- Preserve all sheets in their proper format
- Use the exported file as a backup or for offline analysis
- Share data with team members
- File is named `SheetCuttingBusinessTemplate_Export.xlsx`

**Note**: The exported Excel file contains the current in-memory state of your data. Changes made through CRUD operations are reflected in memory but not automatically saved to the original Excel file. Use the export feature to save your changes.

## Customization

### Modifying the Excel Template

The Excel file structure is defined in `utils/excelUtils.ts`. To customize the data structure:

1. Update the data interfaces in `utils/excelUtils.ts` (Customer, Factory, Purchase, Order, etc.)
2. Modify the Excel file in `/public/SheetCuttingBusinessTemplate.xlsx` to match the new structure
3. Update the page components to reflect the new data structure

### Adding New Features

To add new features to the application:

1. **Add new pages**: Create new files in the `pages/` directory (e.g., `pages/reports.tsx`)
2. **Create reusable components**: Add components in `components/` directory
3. **Add utility functions**: Add helper functions in `utils/`
4. **Update navigation**: Add new page links to `components/Navigation.tsx`
5. **Update home page**: Add description of new features in `pages/index.tsx`

### Excel Data Structure

The application uses TypeScript interfaces to define the data structure:

- `Customer`: Customer profiles (id, name, email, phone, address, notes)
- `Factory`: Supplier/factory profiles (id, name, location, contact, materials)
- `Purchase`: Purchase records (id, date, factoryId, material, size in mm, qty, cost in ₹, batchRef)
- `StockSheet`: Stock inventory (id, purchaseId, factoryId, material, size in mm, status)
- `Order`: Order records (id, orderRef, customerId, sheetId, material, pieceSize in mm, qty, cost in ₹, profit in ₹)
- `Leftover`: Leftover pieces (id, parentSheetId, purchaseId, factoryId, material, dimensions in mm, area)

### Implementing Traceability

To trace materials from factory to customer:

1. **Factory → Purchase**: Check `Purchase.factoryId` matches `Factory.id`
2. **Purchase → Stock**: Check `StockSheet.purchaseId` matches `Purchase.id`
3. **Stock → Order**: Check `Order.sheetId` matches `StockSheet.id`
4. **Order → Customer**: Check `Order.customerId` matches `Customer.id`
5. **Stock → Leftover**: Check `Leftover.parentSheetId` matches `StockSheet.id`

## Data Management

### Reading Data

The application reads data from the Excel file using the `readExcelFile()` function from `utils/excelUtils.ts`. This function is called in the React components using `useEffect()`.

### Writing Data

You can download modified data as a new Excel file using the `writeExcelFile()` function. This creates a downloadable file without modifying the original template.

### Updating the Template

To update the data in the Excel template:

1. Modify `/public/SheetCuttingBusinessTemplate.xlsx` directly using Excel or LibreOffice
2. Or implement a custom update function using the SheetJS library

### Regenerating Sample Data

A script is provided to regenerate the sample Excel data with multiple sheets:

```bash
node scripts/generate-sample-data.js
```

This will create a new Excel file with sample data for:
- Customers (3 sample customers)
- Factories (3 sample factories/suppliers)
- Purchases (3 sample purchases)
- Orders (4 sample orders with traceability)

You can modify the script to customize the sample data for your needs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
