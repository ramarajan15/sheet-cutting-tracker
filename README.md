# Sheet Cutting Tracker

A Next.js web application for managing and tracking sheet cutting operations for your business.

## Features

- **Dashboard**: View summary statistics and charts for your sheet cutting operations
- **Stock Management**: Track material inventory and usage with purchase and factory traceability
- **Orders Management**: Manage customer orders and cutting jobs with sheet-to-factory traceability
- **Leftovers Management**: Track and manage leftover pieces linked to parent sheets
- **Customer Management**: Complete customer profiles with full order history
- **Factory/Supplier Management**: Track suppliers and materials they provide
- **Purchase Management**: Incoming stock tracking with date, factory, material, size, qty, cost, and batch reference
- **Sheet Cutting Visualizer**: Visualize and optimize sheet cutting layouts with manual and auto-arrangement
- **End-to-End Material Traceability**: Full supply chain tracking from factory purchase to customer order

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
- `Order`: Order records (id, orderRef, customerId, sheetId, material, pieceSize, qty, cost, profit)
- `Leftover`: Leftover pieces (id, parentSheetId, purchaseId, factoryId, material, dimensions, area)

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
