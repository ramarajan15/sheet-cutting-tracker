import React, { useState } from 'react';

export default function Visualizer() {
  const [sheetWidth, setSheetWidth] = useState(2400);
  const [sheetHeight, setSheetHeight] = useState(1200);
  const [pieceWidth, setPieceWidth] = useState(600);
  const [pieceHeight, setPieceHeight] = useState(400);

  const calculateLayout = () => {
    const piecesPerRow = Math.floor(sheetWidth / pieceWidth);
    const piecesPerColumn = Math.floor(sheetHeight / pieceHeight);
    const totalPieces = piecesPerRow * piecesPerColumn;
    const usedWidth = piecesPerRow * pieceWidth;
    const usedHeight = piecesPerColumn * pieceHeight;
    const leftoverWidth = sheetWidth - usedWidth;
    const leftoverHeight = sheetHeight - usedHeight;

    return {
      piecesPerRow,
      piecesPerColumn,
      totalPieces,
      usedWidth,
      usedHeight,
      leftoverWidth,
      leftoverHeight,
    };
  };

  const layout = calculateLayout();
  const scale = 0.15; // Scale for visualization

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sheet Cutting Visualizer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Sheet & Piece Dimensions</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sheet Width (mm)
              </label>
              <input
                type="number"
                value={sheetWidth}
                onChange={(e) => setSheetWidth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sheet Height (mm)
              </label>
              <input
                type="number"
                value={sheetHeight}
                onChange={(e) => setSheetHeight(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piece Width (mm)
              </label>
              <input
                type="number"
                value={pieceWidth}
                onChange={(e) => setPieceWidth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piece Height (mm)
              </label>
              <input
                type="number"
                value={pieceHeight}
                onChange={(e) => setPieceHeight(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Layout Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Layout Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pieces per row:</span>
                <span className="font-medium">{layout.piecesPerRow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pieces per column:</span>
                <span className="font-medium">{layout.piecesPerColumn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pieces:</span>
                <span className="font-medium text-blue-600">{layout.totalPieces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leftover width:</span>
                <span className="font-medium text-orange-600">{layout.leftoverWidth} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leftover height:</span>
                <span className="font-medium text-orange-600">{layout.leftoverHeight} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Cutting Layout Preview</h2>
          
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
            <svg
              width={sheetWidth * scale}
              height={sheetHeight * scale}
              className="border border-gray-400"
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {/* Draw pieces */}
              {Array.from({ length: layout.piecesPerColumn }).map((_, row) =>
                Array.from({ length: layout.piecesPerRow }).map((_, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={col * pieceWidth * scale}
                    y={row * pieceHeight * scale}
                    width={pieceWidth * scale}
                    height={pieceHeight * scale}
                    fill="#3b82f6"
                    stroke="#1e40af"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                ))
              )}

              {/* Draw leftover areas */}
              {layout.leftoverWidth > 0 && (
                <rect
                  x={layout.usedWidth * scale}
                  y={0}
                  width={layout.leftoverWidth * scale}
                  height={sheetHeight * scale}
                  fill="#f97316"
                  opacity="0.3"
                />
              )}

              {layout.leftoverHeight > 0 && (
                <rect
                  x={0}
                  y={layout.usedHeight * scale}
                  width={layout.usedWidth * scale}
                  height={layout.leftoverHeight * scale}
                  fill="#f97316"
                  opacity="0.3"
                />
              )}
            </svg>

            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 opacity-80 border border-blue-700"></div>
                <span>Cut Pieces</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 opacity-30"></div>
                <span>Leftover Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Enter your sheet and piece dimensions to visualize the optimal cutting layout. Blue areas represent cut pieces, orange areas show leftover material.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
