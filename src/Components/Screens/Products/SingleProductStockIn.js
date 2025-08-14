import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';




function SingleProductStockIn() {
  const printRef = useRef();
  const numberToEncode = '123456789012'; // You can change this

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Barcode Generator</h2>
      {/* Printable Area */}
      <div ref={printRef} style={{ marginBottom: '20px' }}>
        <p>Barcode for: <strong>{numberToEncode}</strong></p>
        <Barcode value={numberToEncode} format="CODE128" width={2} height={100} fontSize={16} />
      </div>
      {/* Print Button */}
      <button onClick={handlePrint} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Print Barcode
      </button>


    </div>
  );
}