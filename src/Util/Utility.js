
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
export const exportToExcel = (data, fileName = "data.xlsx") => {
    if (data.length === 0) {
        alert("No data to export!");
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
};
export const generateAndSavePdf = (customerName, selectedContactNo, dynamicHeaders, rows) => {
    const doc = new jsPDF();
    doc.text("3_Extent", 14, 20);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, 14, 30);
    doc.text(`Contact No: ${selectedContactNo}`, 14, 37);

    const tableColumn = dynamicHeaders;
    const tableRows = rows.map(row => tableColumn.map(header => row[header]));

    autoTable(doc, {
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
        },
        theme: 'striped',
    });

    doc.save("SalesBilling.pdf");
};

export const handleBarcodePrint = (product) => {
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
            height: 100vh;
            width: 100vw;
            font-family: "Courier New", Courier, monospace;
          }
          #barcode-wrapper {
            position: absolute;
            top: 5%;
            width: 100%;
            text-align: center;
            font-family: sans-serif;
          }
          .header {
            margin: 5px 0px;
            font-size: 100px;
            text-align: center;
            font-weight: bolder;
          }
          .h2 {
            margin: 0;
            font-size: 100px;
            text-align: left;
            font-weight: bolder;
          }
          svg {
            width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div id="barcode-wrapper">
          <h1 class="header">3_EXTENT</h1>
          <h1 class="h2">${product.modelName}</h1>
          <h1 class="h2">Grade : ${product.grade}</h1>
          <svg id="barcode"></svg>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          JsBarcode("#barcode", "${product.imei_number}", {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 25
          });
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
    win.document.close();
    win.focus();
};