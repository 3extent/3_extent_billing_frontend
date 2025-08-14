import React, { useRef, useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

const SingleProductStockIn = () => {
  const [barcodeValue, setBarcodeValue] = useState('123456789012');
  const canvasRef = useRef(null);

  // Generate barcode on canvas
  useEffect(() => {
    if (canvasRef.current) {
      JsBarcode(canvasRef.current, barcodeValue, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 100,
        displayValue: true,
      });
    }
  }, [barcodeValue]);

  // Print barcode using new window
  const handlePrint = () => {
    const dataUrl = canvasRef.current.toDataURL(); // Get image from canvas
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { margin: 0; text-align: center; }
            img { width: auto; height: 100px; margin-top: 50px; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Barcode Generator & Printer</h2>

      <input
        type="text"
        value={barcodeValue}
        onChange={(e) => setBarcodeValue(e.target.value)}
        placeholder="Enter barcode value"
        style={{ padding: 10, fontSize: 16, marginBottom: 20 }}
      />

      <div style={{ margin: '20px 0' }}>
        <canvas ref={canvasRef}></canvas>
      </div>

      <button onClick={handlePrint} style={{ padding: '10px 20px', fontSize: 16 }}>
        Print Barcode
      </button>
    </div>
  );
};

export default SingleProductStockIn;
