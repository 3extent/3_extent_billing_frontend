
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
/**
 * Generates a sales billing PDF and saves it as "SalesBilling.pdf".
 *
 * @param {string} customerName - The name of the customer.
 * @param {string} selectedContactNo - The contact number of the customer.
 * @param {Array} dynamicHeaders - (Unused in this function) Dynamic table headers, possibly for future use.
 * @param {Array} rows - Array of objects, each representing a product/item row with details like Brand, Model, IMEI NO, Grade, and Rate.
 * @param {number} totalAmount - The total amount for all items.
 *
 * This function uses jsPDF and jsPDF-AutoTable to:
 * 1. Create a new PDF document.
 * 2. Add a company header and address.
 * 3. Add customer details and the current date.
 * 4. Generate a table listing all products/items, including a total row.
 * 5. Add a thank you note at the end.
 * 6. Save the PDF as "SalesBilling.pdf".
 */
export const generateAndSavePdf = (
  customerName,
  selectedContactNo,
  dynamicHeaders,
  customerGstNo,
  rows,
  totalAmount
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 5;
  // Add company name and address as header
  const renderHeader = () => {
    // name
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("HRUSHIKESH TANGADKAR", 14, 18);
    // contact no
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("9665856368", 14, 24);
    // company name
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("3_EXTENT", pageWidth / 2, 22, { align: "center" });
    // address
     doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("3rd Floor, Office No. 312", pageWidth / 2, 28, { align: "center" });
    doc.text("Delux Fortune Mall, Pimpri, Pune", pageWidth / 2, 32, { align: "center" });
    doc.text("NR Kotak Bank Office - 411018", pageWidth / 2, 36, { align: "center" });
    // Add customer details and date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, 14, 45);
    doc.text(`Contact No: ${selectedContactNo}`, 14, 51);
    doc.text(`GST No: ${customerGstNo || "-"}`, 14, 57);
    doc.text(`${new Date().toLocaleDateString("en-GB")}`, pageWidth - 14, 51, {
      align: "right",
    });
  }
  const drawPageBorder = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  };

  renderHeader();
  drawPageBorder();
  // Define table columns
  const tableColumn = ["Sr", "Product Description", "IMEI No", "Grade", "Amount"];
  const tableRows = (Array.isArray(rows) ? rows : []).map((row, index) => [
    index + 1,
    `${row.Brand || ""} ${row.Model || ""}`,
    row["IMEI NO"] || "",
    row["Grade"] || "",
    `${Number(row["Rate"] || 0).toFixed(2)}`
  ]);
  const totalRowIndex = tableRows.length;
  // Add a total row at the end
  tableRows.push([
    {
      content: "TOTAL",
      colSpan: 4,
      styles: { halign: "right",fontStyle: "bold",fontSize: 11,},
    },
    {
      content: `${Number(totalAmount).toFixed(2)}`,
      styles: { halign: "right", fontStyle: "bold", fontSize: 11 }
    },
  ]);

  // Generate the table in the PDF
  let pageFinalYs = {};
  autoTable(doc, {
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3},
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], halign: "center", fontStyle: "bold", },
    didDrawPage: (data) => {
      if (data.pageNumber === 1) renderHeader();
      drawPageBorder();
    },
    didDrawCell: (data) => {
      const { cell, row, column, section, table } = data;

      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      pageFinalYs[pageNum] = Math.max(pageFinalYs[pageNum] || 0, cell.y + cell.height);

      doc.setDrawColor(0);
      doc.setLineWidth(0.3);

      const isFirstCol = column.index === 0;
      const isLastCol = column.index === table.columns.length - 1;
      const isTotalRow = section === "body" && row.index === totalRowIndex;

      //  Draw only left & right lines (NO top/bottom)
      doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // Left
      doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // Right

      //  TOTAL row: top & bottom border
      if (isTotalRow) {
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
        doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // bottom
      }

      //  Header: top & bottom border (for visibility)
      if (section === "head") {
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
        doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // bottom
      }
    },
    showHead: "everyPage"
  });

  //  Bottom border of table on every page
  Object.entries(pageFinalYs).forEach(([pageNum, finalY]) => {
    doc.setPage(Number(pageNum));
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(14, finalY, pageWidth - 14, finalY);

  });

  // Add a thank you note below the table
  const finalY = doc.lastAutoTable.finalY + 15;
   if (finalY > pageHeight - 20) {
    doc.addPage();
    drawPageBorder();
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", pageWidth / 2, finalY, { align: "center" });

  // Save the PDF file
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