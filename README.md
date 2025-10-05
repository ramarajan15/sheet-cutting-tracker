# Sheet Cutting Tracker

A comprehensive Next.js web application for managing and tracking sheet cutting operations for your business with end-to-end material traceability.

## Features

### Core Features
- **Dashboard**: View summary statistics and charts for your sheet cutting operations
- **Stock Management**: Track material inventory and usage with batch/reference numbers
- **Orders Management**: Manage customer orders and cutting jobs with full traceability
- **Leftovers Management**: Track and manage leftover pieces and offcuts
- **Sheet Cutting Visualizer**: Visualize and optimize sheet cutting layouts with manual and auto-arrangement

### Customer Management
- **Customer Profiles**: Track customer information including name, contact details, address, company, and notes
- **Order History**: Link each order to a customer and view complete order history
- **Customer Analytics**: View customer statistics including total orders, revenue, and profit
- **/customers Page**: Dedicated page for managing and viewing customer data

### Supplier/Factory Tracking
- **Factory Management**: Track factories/suppliers with contact information, address, and supplied materials
- **Purchase Records**: Track incoming stock purchases from factories with details including date, factory, material, size, quantity, cost, and batch/reference
- **/factories Page**: Manage and view factory/supplier information
- **/purchases Page**: Track all material purchases from factories with filtering options

### End-to-End Material Traceability
- **Batch Tracking**: Each stock sheet is linked to its purchase batch/reference number
- **Factory Source**: Track which factory supplied each material batch
- **Order Traceability**: View which batch and factory each order originated from
- **Complete Chain**: Follow the complete chain from factory → purchase → stock → order

## Technology Stack

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **SheetJS (xlsx)**: Excel file reading/writing
- **Recharts**: Charting library for data visualization

## Data Storage

This application uses an Excel file (`SheetCuttingBusinessTemplate.xlsx`) stored in the `/public` folder as the main data store. The Excel file contains multiple sheets:

- **Orders**: All cutting orders with traceability information
- **Customers**: Customer profiles and contact information
- **Factories**: Supplier/factory information
- **Purchases**: Material purchase records from factories

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

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

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
sheet-cutting-tracker/
├── pages/                 # Next.js pages
│   ├── index.tsx         # Home page
│   ├── dashboard.tsx     # Dashboard with charts
│   ├── stock.tsx         # Stock management
│   ├── orders.tsx        # Orders management
│   ├── customers.tsx     # Customer management (NEW)
│   ├── factories.tsx     # Factory/supplier management (NEW)
│   ├── purchases.tsx     # Purchase tracking (NEW)
│   ├── leftovers.tsx     # Leftovers management
│   └── visualizer.tsx    # Sheet cutting visualizer
├── components/           # React components
│   ├── Layout.tsx        # Main layout wrapper
│   └── Navigation.tsx    # Navigation menu
├── utils/                # Utility functions
│   └── excelUtils.ts     # Excel file operations
├── public/               # Static files
│   └── SheetCuttingBusinessTemplate.xlsx  # Data file
└── styles/               # CSS styles
    └── globals.css       # Global styles
```

## Usage Guide

### Customer Management

1. Navigate to **/customers** page
2. View all customer profiles with contact information
3. Click "View Orders" to see a customer's complete order history
4. See customer analytics including total orders, revenue, and profit

### Factory/Supplier Management

1. Navigate to **/factories** page
2. View all factory/supplier information
3. Click "View Purchases" to see all purchases from a specific factory
4. Track supplied materials and factory statistics

### Purchase Tracking

1. Navigate to **/purchases** page
2. View all material purchases with batch/reference numbers
3. Filter by factory or material type
4. Track purchase costs and quantities

### Material Traceability

1. In the **Orders** page, view the "Batch/Ref" and "Factory" columns
2. In the **Stock** page, see which factory and batch each material came from
3. In the **Leftovers** page, track the source of leftover materials
4. Follow the complete chain: Factory → Purchase → Stock → Order

## Deployment to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

## Customization

### Modifying the Excel Template

The Excel file structure is defined in `utils/excelUtils.ts`. To customize the data structure:

1. Update the interfaces in `utils/excelUtils.ts`:
   - `SheetData` - For orders
   - `Customer` - For customer profiles
   - `Factory` - For factory/supplier info
   - `Purchase` - For purchase records
2. Modify the Excel file in `/public/SheetCuttingBusinessTemplate.xlsx`
3. Update the page components to reflect the new data structure

### Adding New Features

- Add new pages in the `pages/` directory
- Create reusable components in `components/`
- Add utility functions in `utils/`
- Update the navigation in `components/Navigation.tsx`

## Data Management

### Reading Data

The application reads data from the Excel file using functions from `utils/excelUtils.ts`:
- `readExcelFile()` - Read orders data
- `readCustomers()` - Read customer profiles
- `readFactories()` - Read factory information
- `readPurchases()` - Read purchase records

These functions are called in the React components using `useEffect()`.

### Writing Data

You can download modified data as a new Excel file using the `writeExcelFile()` function. This creates a downloadable file without modifying the original template.

### Updating the Template

To update the data in the Excel template:

1. Modify `/public/SheetCuttingBusinessTemplate.xlsx` directly using Excel or LibreOffice
2. Ensure all sheets (Orders, Customers, Factories, Purchases) maintain their structure
3. Or implement a custom update function using the SheetJS library

## Excel File Structure

### Orders Sheet
Contains all order records with columns:
- Material, Date, Customer, Order Ref
- Sheet Used (Y/N), Piece Size (mm), Qty
- Area calculations, Costs, Sales, Profit
- **Batch/Ref** (for traceability)
- **Factory Name** (for traceability)
- Leftover Area, Offcut Used, Notes

### Customers Sheet
Contains customer profiles with columns:
- Customer Name, Contact, Phone, Email
- Address, Company, Notes

### Factories Sheet
Contains supplier information with columns:
- Factory Name, Contact Person, Phone, Email
- Address, Supplied Materials, Notes

### Purchases Sheet
Contains purchase records with columns:
- Purchase Date, Factory Name, Material
- Size (mm), Quantity, Unit Cost, Total Cost
- Batch/Ref, Notes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

