import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';

function CustomBarcodePrintComponent({ modelName, grade, imei }) {
  const barcodeRef = useRef();

  const handlePrint = () => {
    html2canvas(barcodeRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.write('<img src="' + imgData + '" />');
      printWindow.document.close();
      printWindow.print();
    });
  };

  return (
    <div>
      <div ref={barcodeRef} className="font-serif text-center p-5 bg-white">
        <div className="text-2xl font-semibold text-gray-800">{modelName}</div>
        <div className="text-lg text-gray-600">
          <strong>Grade:</strong> {grade}
        </div>
        <div>
          <Barcode value={imei} format="CODE128" />
        </div>
      </div>
      <button onClick={handlePrint}>Print Barcode</button>
    </div>
  );
}

export default CustomBarcodePrintComponent;