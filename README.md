# Sheet Cutting Tracker

A Next.js web application for managing and tracking sheet cutting operations for your business.

## Features

- **Dashboard**: View summary statistics and charts for your sheet cutting operations
- **Stock Management**: Track material inventory and usage
- **Orders Management**: Manage customer orders and cutting jobs
- **Leftovers Management**: Track and manage leftover pieces and offcuts
- **Sheet Cutting Visualizer**: Visualize and optimize sheet cutting layouts with manual and auto-arrangement

## Technology Stack

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **SheetJS (xlsx)**: Excel file reading/writing
- **Recharts**: Charting library for data visualization

## Data Storage

This application uses an Excel file (`SheetCuttingBusinessTemplate.xlsx`) stored in the `/public` folder as the main data store. The Excel file contains all the sheet cutting data including orders, materials, costs, and leftovers.

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

1. Update the `SheetData` interface in `utils/excelUtils.ts`
2. Modify the Excel file in `/public/SheetCuttingBusinessTemplate.xlsx`
3. Update the page components to reflect the new data structure

### Adding New Features

- Add new pages in the `pages/` directory
- Create reusable components in `components/`
- Add utility functions in `utils/`
- Update the navigation in `components/Navigation.tsx`

## Data Management

### Reading Data

The application reads data from the Excel file using the `readExcelFile()` function from `utils/excelUtils.ts`. This function is called in the React components using `useEffect()`.

### Writing Data

You can download modified data as a new Excel file using the `writeExcelFile()` function. This creates a downloadable file without modifying the original template.

### Updating the Template

To update the data in the Excel template:

1. Modify `/public/SheetCuttingBusinessTemplate.xlsx` directly using Excel or LibreOffice
2. Or implement a custom update function using the SheetJS library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
