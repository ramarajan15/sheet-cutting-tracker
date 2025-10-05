# Sheet Cutting Tracker - Implementation Guide

## Overview

This Next.js TypeScript application provides complete end-to-end material traceability for sheet cutting operations, from factory purchase to customer order fulfillment.

## Architecture

### Data Flow

```
Factory → Purchase → Stock Sheet → Order → Customer
                              ↓
                          Leftover
```

### Key Components

1. **Excel Data Store** (`/public/SheetCuttingBusinessTemplate.xlsx`)
   - Multi-sheet workbook containing all business data
   - Sheets: Orders, Customers, Factories, Purchases
   - No database required - all data in Excel

2. **TypeScript Interfaces** (`/utils/excelUtils.ts`)
   - `Customer`: Customer profile data
   - `Factory`: Supplier/factory information
   - `Purchase`: Incoming stock purchases
   - `Order`: Customer orders with traceability
   - `Leftover`: Leftover pieces from cuts
   - `SheetData`: Legacy format for backward compatibility

3. **Pages** (`/pages/*.tsx`)
   - Dashboard: Overview and charts
   - Stock: Material inventory with factory links
   - Orders: Customer orders with traceability
   - Leftovers: Leftover piece management
   - Customers: Customer profiles and order history
   - Factories: Supplier profiles and purchase history
   - Purchases: Incoming stock tracking
   - Visualizer: Sheet cutting layout planning

## Material Traceability

Every material can be traced through the complete supply chain:

1. **Factory to Purchase**: Each purchase record links to a factory via `factoryId`
2. **Purchase to Product**: Each purchase links to a product via `productId`
3. **Purchase to Stock**: Stock sheets link to purchases via `purchaseId`
4. **Stock to Order**: Orders link to stock sheets via `sheetId`
5. **Order to Product**: Order items link to products via `productId`
6. **Order to Customer**: Orders link to customers via `customerId`
7. **Stock to Leftover**: Leftovers link to parent sheets via `parentSheetId`

This enables questions like:
- "Which factory supplied the material for this customer order?"
- "What product was used in this order?"
- "What orders were fulfilled from this batch?"
- "Which leftovers came from factory X?"

## Customization Guide

### Adding New Fields

1. Update the TypeScript interface in `utils/excelUtils.ts`
2. Modify the Excel file to include the new column
3. Update the relevant page component to display the field

### Adding New Pages

1. Create a new file in `/pages` directory (e.g., `reports.tsx`)
2. Add navigation link in `components/Navigation.tsx`
3. Update home page in `pages/index.tsx`
4. Add page description to README.md

### Adding New Excel Sheets

1. Update `utils/excelUtils.ts` with new interface
2. Add reader function (e.g., `readReports()`)
3. Create corresponding page component
4. Update the Excel file with new sheet

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Modify Data**
   - Edit `/public/SheetCuttingBusinessTemplate.xlsx`
   - Or run `node scripts/generate-sample-data.js` to regenerate

3. **Test Changes**
   - Check linting: `npm run lint`
   - Build application: `npm run build`

4. **Deploy to Vercel**
   - Push to GitHub
   - Connect repository to Vercel
   - Automatic deployment on push

## Excel File Structure

### Orders Sheet
Columns: Order Ref, Date, Customer ID, Customer, Sheet ID, Purchase ID, Factory ID, Factory Name, Batch Ref, Material, Piece Size (mm), Qty, Area per Piece (m²), Total Area Used (m²), Unit Cost, Unit Sale Price, Total Cost, Total Sale, Profit, Leftover Area (m²), Offcut Used? (Y/N), Sheet Used (Y/N), Notes

### Customers Sheet
Columns: id, name, email, phone, address, notes

### Factories Sheet
Columns: id, name, location, contact, email, phone, materials, notes

### Purchases Sheet
Columns: id, date, factoryId, factoryName, productId, productName, size, thickness, qty, unitCost, totalCost, batchRef, notes

## Technology Stack

- **Next.js 14**: React framework with server-side rendering
- **TypeScript**: Type-safe code throughout
- **Tailwind CSS**: Utility-first styling
- **SheetJS (xlsx)**: Excel file processing
- **Recharts**: Data visualization

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for data
2. **Error Handling**: Wrap async operations in try-catch blocks
3. **Loading States**: Show loading indicators during data fetch
4. **Data Validation**: Validate Excel data before display
5. **Performance**: Use React hooks efficiently (useMemo, useCallback)

## Troubleshooting

### Excel File Not Loading
- Check file is in `/public` directory
- Verify file name matches: `SheetCuttingBusinessTemplate.xlsx`
- Ensure browser can access `/SheetCuttingBusinessTemplate.xlsx`

### Data Not Displaying
- Check sheet names match exactly (case-sensitive)
- Verify column headers match interface field names
- Check browser console for errors

### Build Errors
- Run `npm run lint` to check for issues
- Verify all imports are correct
- Check TypeScript types are properly defined

## Support

For issues or questions:
1. Check documentation in README.md
2. Review code comments in source files
3. Open an issue on GitHub

## License

ISC
