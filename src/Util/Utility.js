
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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Draw the header only once at the beginning
    const renderHeader = () => {
        // Left-side name and phone
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text("HRUSHIKESH TANGADKAR", 14, 18); // Top left

        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("+91-9876543210", 14, 24); // Below name

        // Centered business name
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.text("3_EXTENT", pageWidth / 2, 22, { align: "center" });

        // Address lines below center title
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("3rd Floor, Office No. 312", pageWidth / 2, 28, { align: "center" });
        doc.text("Delux Fortune Mall, Pimpri, Pune", pageWidth / 2, 32, { align: "center" });
        doc.text("NR Kotak Bank Office - 411018", pageWidth / 2, 36, { align: "center" });

        // Customer Details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Customer Name: ${customerName}`, 14, 45);
        doc.text(`Contact No: ${selectedContactNo}`, 14, 51);
        doc.text(`GST No: ${customerGstNo || "-"}`, 14, 57);
        doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, pageWidth - 14, 51, {
            align: "right",
        });
    };

    renderHeader(); // Call the header function here

    const tableColumn = ["Sr", "Product Description", "IMEI No", "Grade", "Amount"];

    // Create only the data rows
    const dataRows = rows.map((row, index) => [
        index + 1,
        `${row.Brand || ""} ${row.Model || ""}`,
        row["IMEI NO"] || "",
        row["Grade"] || "",
        `${Number(row["Rate"] || 0).toFixed(2)}`,
    ]);

    // Add TOTAL row
    dataRows.push([
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
            content: `${Number(totalAmount).toFixed(2)}`,
            styles: {
                halign: "right",
                fontStyle: "bold",
                fontSize: 11,
            },
        },
    ]);

    // Generate table with total row
    autoTable(doc, {
        startY: 65, // Start the table below the header
        head: [tableColumn],
        body: dataRows,
        theme: "plain", // 'plain' theme selected
        margin: { left: 14, right: 14 },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            halign: "center",
            fontStyle: "bold",
            // Removed horizontal line below header
        },
        // Removed horizontal lines in body
        bodyStyles: {
            // Only vertical lines are needed so nothing here
        },
        // Using 'didDrawCell' to draw only vertical lines
        didDrawCell: (data) => {
            // Only vertical lines for body and header
            if (data.section === 'body' || data.section === 'head') {
                doc.setDrawColor(0, 0, 0); // Black color
                doc.setLineWidth(0.3);

                // Draw vertical line on the right side of the cell
                doc.line(data.cell.x + data.cell.width, data.cell.y, data.cell.x + data.cell.width, data.cell.y + data.cell.height);

                // Draw vertical line on the left side of the first cell
                if (data.column.index === 0) {
                    doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.cell.height);
                }
            }
        },
        showHead: "everyPage",
    });

    // Add Thank You Note
    const finalTableY = doc.lastAutoTable.finalY;
    if (finalTableY + 10 > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", pageWidth / 2, doc.lastAutoTable.finalY + 10, {
        align: "center",
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