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
        width: 2,
        height: 40,
        displayValue: true,
      });
    }
  }, [imei]);

  const handlePrint = () => {
    const printContents = printAreaRef.current.innerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            svg {
              max-width: 100%;
              height: auto;
              page-break-inside: avoid;
            }
          }
          body {
            font-family: sans-serif;
            text-align: center;
            padding: 20px;
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