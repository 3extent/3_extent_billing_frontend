import { useRef } from "react";
import Barcode from "react-barcode";
import PrimaryButtonComponent from "../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

function CustomBarcodePrintComponent({ modelName, grade, imei }) {
    const barcodeRef = useRef();

    const handlePrint = () => {
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
    };

    return (
        <div className="flex flex-col items-center mt-6">
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
            <div className="mt-4 w-[300px]">
                < PrimaryButtonComponent    
                    label="Print Barcode"
                    icon="fa fa-print"
                    className="w-full"
                    onClick={handlePrint}
                />
            </div>
        </div>

    )
} export default CustomBarcodePrintComponent;
