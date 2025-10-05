import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sheetWidth, setSheetWidth] = useState(2400);
  const [sheetHeight, setSheetHeight] = useState(1200);
  const [pieces, setPieces] = useState<Rectangle[]>([]);
  const [pieceWidth, setPieceWidth] = useState(600);
  const [pieceHeight, setPieceHeight] = useState(400);
  const [pieceLabel, setPieceLabel] = useState('');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sheet background
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    const gridSize = 50;
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw sheet border
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw pieces
    pieces.forEach((piece, index) => {
      ctx.fillStyle = piece.color;
      ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
      
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
      
      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = piece.label || `Piece ${index + 1}`;
      ctx.fillText(text, piece.x + piece.width / 2, piece.y + piece.height / 2);
      
      // Draw dimensions
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `${Math.round(piece.width)}x${Math.round(piece.height)}`,
        piece.x + piece.width / 2,
        piece.y + piece.height / 2 + 15
      );
    });
  }, [pieces]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, sheetWidth, sheetHeight]);

  const addPieceManually = () => {
    const scale = 600 / sheetWidth;
    const scaledPieceWidth = pieceWidth * scale;
    const scaledPieceHeight = pieceHeight * scale;

    // Simple placement logic: find next available position
    let placed = false;
    for (let y = 0; y <= 400 - scaledPieceHeight; y += 50) {
      for (let x = 0; x <= 600 - scaledPieceWidth; x += 50) {
        const overlaps = pieces.some(piece => 
          !(x + scaledPieceWidth <= piece.x || 
            x >= piece.x + piece.width || 
            y + scaledPieceHeight <= piece.y || 
            y >= piece.y + piece.height)
        );
        
        if (!overlaps) {
          const newPiece: Rectangle = {
            x,
            y,
            width: scaledPieceWidth,
            height: scaledPieceHeight,
            label: pieceLabel || `Piece ${pieces.length + 1}`,
            color: COLORS[pieces.length % COLORS.length],
          };
          setPieces([...pieces, newPiece]);
          setPieceLabel('');
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (!placed) {
      alert('Cannot fit piece on sheet. Try adjusting dimensions or clearing some pieces.');
    }
  };

  const autoArrangePieces = () => {
    // Simple auto-arrangement algorithm (First Fit Decreasing)
    const scale = 600 / sheetWidth;
    const sortedPieces = [...pieces].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const arranged: Rectangle[] = [];

    sortedPieces.forEach((piece) => {
      let placed = false;
      for (let y = 0; y <= 400 - piece.height; y += 10) {
        for (let x = 0; x <= 600 - piece.width; x += 10) {
          const overlaps = arranged.some(p => 
            !(x + piece.width <= p.x || 
              x >= p.x + p.width || 
              y + piece.height <= p.y || 
              y >= p.y + p.height)
          );
          
          if (!overlaps) {
            arranged.push({ ...piece, x, y });
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    });

    setPieces(arranged);
  };

  const clearAll = () => {
    setPieces([]);
  };

  const removePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  const calculateUtilization = () => {
    const totalPieceArea = pieces.reduce((sum, piece) => sum + (piece.width * piece.height), 0);
    const sheetArea = 600 * 400; // Canvas dimensions
    return ((totalPieceArea / sheetArea) * 100).toFixed(2);
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Sheet Cutting Visualizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Sheet Configuration</h2>
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Add Piece</h2>
            <div className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label (optional)
                </label>
                <input
                  type="text"
                  value={pieceLabel}
                  onChange={(e) => setPieceLabel(e.target.value)}
                  placeholder="e.g., Door Panel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addPieceManually}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
              >
                Add Piece
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={autoArrangePieces}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
              >
                Auto-Arrange Pieces
              </button>
              <button
                onClick={clearAll}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sheet Layout</h2>
              <div className="text-sm text-gray-600">
                Utilization: <span className="font-bold text-blue-600">{calculateUtilization()}%</span>
              </div>
            </div>
            
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="mx-auto"
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>Sheet dimensions: {sheetWidth}mm × {sheetHeight}mm</p>
              <p>Pieces placed: {pieces.length}</p>
            </div>
          </div>

          {/* Pieces List */}
          {pieces.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Placed Pieces</h2>
              <div className="space-y-2">
                {pieces.map((piece, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: piece.color }}
                      />
                      <span className="font-medium">{piece.label}</span>
                      <span className="text-sm text-gray-600">
                        ({Math.round((piece.width / 600) * sheetWidth)}mm × {Math.round((piece.height / 400) * sheetHeight)}mm)
                      </span>
                    </div>
                    <button
                      onClick={() => removePiece(index)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Use this visualizer to plan your sheet cutting layout. Add pieces manually or use auto-arrange to optimize placement. 
              The grid represents your sheet material, and pieces are automatically placed to minimize waste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
