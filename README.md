# Sheet Cutting Tracker

A Next.js web application for managing and tracking sheet cutting operations for your business, featuring an enriched home page inspired by hylamsheets.com showcasing Hylam Sheets products and business tracking capabilities.

## Features

### Enriched Home Page
- **Hero Section**: Eye-catching gradient banner highlighting Hylam Sheets premium laminate solutions
- **Company Introduction**: About Hylam Sheets with trust markers (50+ years experience, 500+ designs, 100% quality assured)
- **Product Showcase**: Three main product categories with visuals:
  - Decorative Laminates
  - Industrial Laminates
  - Compact Laminates
- **Applications**: Real-world use cases across furniture, interior design, and commercial spaces
- **Features Section**: Key benefits including premium quality, timely delivery, custom solutions, and expert support
- **Business Tracking Hub**: Prominent navigation to all business management features
- **Trust Markers**: ISO certification, 5000+ clients, 24/7 support, pan-India delivery
- **Modern Design**: Fully responsive layout with clean aesthetics inspired by hylamsheets.com

### Business Management Tools
- **Dashboard**: View summary statistics and charts for your sheet cutting operations
- **Stock Management**: Track material inventory and usage with purchase and factory traceability
- **Orders Management**: Manage customer orders and cutting jobs with sheet-to-factory traceability
- **Leftovers Management**: Track and manage leftover pieces linked to parent sheets
- **Customer Management**: Complete customer profiles with full order history and CRUD operations
- **Factory/Supplier Management**: Track suppliers and materials they provide with full CRUD operations
- **Purchase Management**: Incoming stock tracking with date, factory, material, size, qty, cost, and batch reference with CRUD operations
- **Category Management**: Organize products by categories with full CRUD operations
- **Product Management**: Complete product catalog with specifications including size (L×W×T mm), area (mm²), unit cost (₹/mm²), colour, and weight with full CRUD operations
- **Sheet Cutting Visualizer**: Visualize and optimize sheet cutting layouts with manual and auto-arrangement
- **End-to-End Material Traceability**: Full supply chain tracking from factory purchase to customer order
- **CRUD Operations**: Create, Read, Update, and Delete functionality for all data entities (Factories, Purchases, Customers, Orders, Categories, Products)
- **Excel Export**: Export all data to Excel file for offline use and backup

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
- **Categories**: Product categories for organization and filtering
- **Products**: Product catalog with specifications (ID, Name, Category, Size L×W×T mm, Area mm², Unit Cost ₹/mm², Colour, Weight g)
- **Stock**: Stock sheet inventory with purchase and factory links
- **Orders** (enhanced): Orders with customer and sheet traceability
- **Leftovers**: Leftover pieces linked to parent sheets with factory information

### Units of Measurement

**Important**: This application uses the following standardized units throughout:

- **Dimensions (Length, Width)**: All dimensions are in **millimeters (mm)**
  - Piece sizes (e.g., "500x300" means 500mm × 300mm)
  - Sheet sizes (e.g., "2440x1220" means 2440mm × 1220mm)
  - All dimension inputs and displays are in millimeters

- **Area**: Calculated areas are in **square meters (m²)**
  - Area per piece, total area used, leftover area

- **Currency**: All prices and costs are in **Indian Rupees (₹)**
  - Unit cost, unit sale price, total cost, total sale, profit
  - All monetary values throughout the application

These units are enforced throughout the UI, forms, tables, and Excel integration.

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
│   ├── index.tsx         # Enriched home page with Hylam Sheets showcase
│   ├── dashboard.tsx     # Dashboard with charts
│   ├── stock.tsx         # Stock management
│   ├── orders.tsx        # Orders management
│   ├── leftovers.tsx     # Leftovers management
│   ├── customers.tsx     # Customer profiles and order history
│   ├── factories.tsx     # Factory/supplier profiles
│   ├── purchases.tsx     # Purchase management
│   ├── categories.tsx    # Category management
│   ├── products.tsx      # Product catalog management
│   └── visualizer.tsx    # Sheet cutting visualizer
├── components/           # React components
│   ├── Layout.tsx        # Main layout wrapper with home page special handling
│   ├── Navigation.tsx    # Navigation menu
│   └── Modal.tsx         # Reusable modal component
├── utils/                # Utility functions
│   └── excelUtils.ts     # Excel file operations and data interfaces
├── public/               # Static files
│   ├── images/           # Product and application images
│   │   ├── hylam-sheet-hero.svg
│   │   ├── product-decorative.svg
│   │   ├── product-industrial.svg
│   │   ├── product-compact.svg
│   │   ├── application-furniture.svg
│   │   ├── application-interior.svg
│   │   └── application-commercial.svg
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

## Home Page Design

The home page has been enriched to showcase Hylam Sheets products and services while maintaining easy access to business tracking features. The design is inspired by hylamsheets.com and includes:

### Page Sections

1. **Hero Banner**: Full-width gradient section with compelling headline and primary CTAs
2. **Company Introduction**: Statistics and trust markers (50+ years, 500+ designs, 100% quality)
3. **Product Showcase**: Three main product categories with images and features
4. **Applications**: Real-world use cases with visual representations
5. **Why Choose Hylam**: Four key value propositions with icons
6. **Business Tracking Hub**: Complete navigation grid to all management features
7. **Trust Markers**: ISO certification, client count, support availability, delivery coverage
8. **Call to Action**: Final CTA section encouraging users to access the dashboard

### Design Principles

- **Modern & Clean**: Contemporary design with gradient backgrounds and card-based layouts
- **Fully Responsive**: Mobile-first design that adapts seamlessly to all screen sizes
- **Visual Hierarchy**: Clear content organization guiding users from products to business tools
- **Prominent Navigation**: Business tracking features are highly visible and accessible
- **No Contact Forms/Testimonials**: Focus on product information and business tools as requested

The home page uses SVG placeholder images stored in `/public/images/` for products and applications. These can be replaced with actual product photography as needed.

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
   - Optional fields: Date, Size, Thickness, Quantity, Unit Cost, Batch Reference, and Notes
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

### Managing Categories

Navigate to `/categories` to manage product categories:

1. **Add New Category**: Click the "Add New Category" button
   - Required fields: Category ID and Name
   - Optional field: Description
   - Click "Add Category" to save

2. **Edit Category**: Click "Edit" next to any category in the table
   - Modify name or description (ID is locked)
   - Click "Save Changes" to update

3. **Delete Category**: Click "Delete" next to any category
   - Confirm deletion in the popup modal
   - Warning: Products associated with this category may be affected

4. **Search and Sort**: 
   - Use the search bar to find categories by ID, name, or description
   - Click column headers to sort by that field (ascending/descending)
   - Summary cards show total categories and filtered results

5. **Export Data**: Click "Export to Excel" to download current category data

### Managing Products

Navigate to `/products` to manage your product catalog:

1. **Add New Product**: Click the "Add New Product" button
   - Required fields: Product ID, Name, Category, Length (mm), Width (mm), Thickness (mm)
   - **Category Selection**: Choose from existing categories via dropdown
   - **Dimensions**: Enter size in millimeters
     - Length (mm): e.g., 2440
     - Width (mm): e.g., 1220
     - Thickness (mm): e.g., 1.0
   - **Auto-calculated**: Area (mm²) = Length × Width
   - Optional fields:
     - Unit Cost (₹/mm²): Cost per 1mm × 1mm
     - Colour: e.g., "Oak Brown"
     - Weight (grams): e.g., 15000
     - Notes: Additional product information
   - Click "Add Product" to save

2. **Edit Product**: Click "Edit" next to any product in the table
   - Modify any fields (ID is locked)
   - Area updates automatically when dimensions change
   - Click "Save Changes" to update

3. **Delete Product**: Click "Delete" next to any product
   - Confirm deletion in the popup modal

4. **Filter and Search**: 
   - Use the search bar to find products by ID, name, category, or colour
   - Filter by category using the dropdown
   - Click column headers to sort (ID, Name, Category, Area, Unit Cost, Colour, Weight)
   - Summary cards show product counts, categories, and average unit cost

5. **Export Data**: Click "Export to Excel" to download current product and category data

### Managing Orders

Navigate to `/orders` to manage customer orders with multi-item support:

1. **Add New Order**: Click the "Add New Order" button
   - Required fields: Order ID, Order Ref, and Customer
   - **Multi-Item Support**: Each order can contain multiple line items
     - Click "+ Add Item" to add additional line items
     - Each line item requires: Material, Length (mm), Width (mm), and Quantity
     - Optional per item: Unit Cost (₹) and Unit Sale Price (₹)
     - Click "Remove" to delete a line item (minimum 1 item required)
   - **Automatic Calculations**:
     - Item totals (cost, sale, profit) are calculated automatically for each line item
     - Order totals aggregate across all line items
   - Order-level notes can be added for the entire order
   - Click "Add Order" to save

2. **View Order Details**: 
   - Orders display with total values and item count badge
   - Click the expand button (▶) next to an order to view line items
   - Expanded view shows detailed breakdown of each line item with:
     - Material type
     - Dimensions (length × width in mm)
     - Quantity
     - Unit cost and sale price
     - Total cost, sale, and profit per item

3. **Edit Order**: Click "Edit" next to any order in the table
   - Modify order details and line items
   - Add or remove line items as needed
   - All totals update automatically
   - Click "Save Changes" to update

4. **Delete Order**: Click "Delete" next to any order
   - Confirm deletion in the popup modal
   - This will delete the order and all its line items

5. **Filter Orders**: Use the material filter dropdown to narrow down orders
   - Filters orders containing items with the selected material
   - Summary cards update automatically to reflect filtered data

6. **Export Data**: Click "Export to Excel" to download current order and customer data
   - Multi-item orders are exported with each line item as a separate row
   - Order totals are included on the first item row for easy aggregation

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
- `Purchase`: Purchase records (id, date, factoryId, material, size, qty, cost, batchRef)
- `StockSheet`: Stock inventory (id, purchaseId, factoryId, material, size, status)
- `Order`: Order records with multi-item support:
  - Order-level: id, orderRef, date, customerId, items[], totalCost, totalSale, profit, notes
  - Each item (OrderItem): id, material, length, width, qty, unitCost, unitSalePrice, totalCost, totalSale, profit, notes
  - Legacy fields maintained for backward compatibility
- `Leftover`: Leftover pieces (id, parentSheetId, purchaseId, factoryId, material, dimensions, area)

**Multi-Item Orders**: Orders now support multiple line items, allowing a single customer order to include different materials, sizes, and quantities. The system automatically calculates totals at both item and order levels. Legacy single-item orders are automatically migrated to the new structure.

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
