import React, { useRef } from 'react';
import Barcode from 'react-barcode';

export default function SingleProductStockIn() {
  const printRef = useRef();

  const handlePrint = () => {
    const html = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=600,height=400');
    win.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            @media print {
              body * {
                visibility: hidden;
              }
              #print-box, #print-box * {
                visibility: visible;
              }
              #print-box {
                position: absolute;
                top: 0;
                left: 0;
              }
              html, body {
                height: initial !important;
                overflow: initial !important;
              }
            }
          </style>
        </head>
        <body onload="window.focus(); window.print();">
          <div id="print-box">${html}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.onafterprint = () => win.close();
  };

  return (
    <div>
      <div ref={printRef}>
        <Barcode value="123456789012" />
      </div>
      <button onClick={handlePrint}>Print Barcode</button>
    </div>
  );
}
