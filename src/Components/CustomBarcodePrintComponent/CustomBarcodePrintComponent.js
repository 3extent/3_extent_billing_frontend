import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Barcode from "react-barcode";
function CustomBarcodePrintComponent(props, ref) {
  const { modelName, grade, imei } = props;
  const barcodeRef = useRef();
  useImperativeHandle(ref, () => ({
    handlePrint: () => {
      const printContents = barcodeRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=600,height=400');
      printWindow.document.write(`
                <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        @media print {
                            @page {
                                size: landscape;
                                margin: 10mm;
                            }
                        }
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 30px;
                        }
                    </style>
                </head>
                <body>${printContents}</body>
                </html>
            `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }));
  return (
    <div className="hidden">
      <div
        ref={barcodeRef}
        className="bg-white p-6 border border-gray-300 shadow-md text-center w-[300px] rounded"
      >
        <div className="font-serif text-lg mb-2">
          <div className="text-gray-800 font-semibold">{modelName}</div>
          <div className="text-gray-600"><strong>Grade :</strong> {grade}</div>
        </div>
        <Barcode value={imei} />
      </div>
    </div>
  );
}
export default forwardRef(CustomBarcodePrintComponent);
