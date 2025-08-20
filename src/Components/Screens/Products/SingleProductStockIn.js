import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

const SingleProductStockIn = () => {
  const [imei, setImei] = useState('123456789012345'); // Default IMEI
  const barcodeRef = useRef();
  const printAreaRef = useRef();

  useEffect(() => {
    if (imei && barcodeRef.current) {
      JsBarcode(barcodeRef.current, imei, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,           // Narrower bars for compact layout
        height: 100,         // Shorter height to fit within page bounds
        displayValue: true, // Shows the IMEI below the barcode
        fontSize: 14,       // Adjust font size for readability
        margin: 10,         // Adds padding around the barcode
      });
    }
  }, [imei]);

  const handlePrint = () => {
    const printContents = printAreaRef.current.innerHTML;
    const win = window.open('', '', 'height=800,width=600');
    win.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          svg {
            width: 100%;
            height: auto;
            transform: rotate(90deg);
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
    win.document.close();
    win.focus();
    win.print();
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>IMEI Barcode Generator</h2>
      <input
        type="text"
        value={imei}
        onChange={(e) => setImei(e.target.value)}
        placeholder="Enter IMEI"
        style={{ padding: '8px', fontSize: '16px', marginBottom: '20px', width: '300px' }}
      />
      <div ref={printAreaRef}>
        <svg ref={barcodeRef}></svg>
      </div>
      <button
        onClick={handlePrint}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Print Barcode
      </button>
    </div>
  );
};

export default SingleProductStockIn;