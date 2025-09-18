
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
export const generateAndSavePdf = (
  customerName,
  selectedContactNo,
  dynamicHeaders,
  rows,
  totalAmount
) => {
  const doc = new jsPDF();
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("3_EXTENT", 105, 20, { align: "center" });
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("3rd Floor, Office No. 312", 105, 26, { align: "center" });
  doc.text("Delux Fortune Mall, Pimpri, Pune", 105, 30, { align: "center" });
  doc.text("NR Kotak Bank Office - 411018", 105, 34, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Customer Name: ${customerName}`, 14, 45);
  doc.text(`Contact No: ${selectedContactNo}`, 14, 51);
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 150, 51);
  const tableColumn = ["Sr", "Product Description", "IMEI No", "Grade", "Amount"];
  const tableRows = rows.map((row, index) => [
    index + 1,
    `${row.Brand || ""} ${row.Model || ""}`,
    row["IMEI NO"] || "",
    row["Grade"] || "",
    `₹ ${Number(row["Rate"] || 0).toFixed(2)}`
  ]);
  tableRows.push([
    {
      content: "TOTAL",
      colSpan: 4,
      styles: {
        halign: "right",
        fontStyle: "bold",
        fontSize: 11,
      },
    },
    {
      content: `₹ ${Number(totalAmount).toFixed(2)}`,
      styles: {
        fontStyle: "bold",
        fontSize: 11,
        halign: "right",
      },
    },
  ]);
  autoTable(doc, {
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      halign: "center",
      fontStyle: "bold",
    },
    theme: "grid",
    margin: { left: 14, right: 14 },
  });
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 105, finalY, { align: "center" });
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
            height: 100%;
            width: 100%;
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
            fontSize: 30
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