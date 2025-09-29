
import ExcelJS from "exceljs";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { toWords } from 'number-to-words';
export const exportToExcel = async (data, fileName = "StyledData.xlsx") => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  const headers = Object.keys(data[0]).filter(
    (header) => !["id", "Supplier", "Actions"].includes(header)
  );
  // 1 & 2: Merged title rows
  const title = "3 EXTENT";
  worksheet.mergeCells(1, 1, 2, headers.length); // Merge A1 to last column in row 2
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { bold: true, name: "Times New Roman", color: { argb: "FFFAA500" }, size: 18 };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  // 3: Date row
  const dateCell = worksheet.getCell("A3");
  dateCell.value = `Date: ${new Date().toLocaleDateString()}`;
  dateCell.font = { italic: true, color: { argb: "FFFAA500" } };
  worksheet.mergeCells(3, 1, 3, headers.length); // Merge full row for date

  // 5: Headers
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFAA500" } // Orange background
    };
    cell.alignment = { horizontal: "center" };
  });

  // 6+: Data rows
  data.forEach((item) => {
    const row = headers.map((key) => item[key]);
    worksheet.addRow(row);
  });

  // Auto width for columns
  worksheet.columns.forEach((col) => {
    let maxLength = 9;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value?.toString() || "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    col.width = maxLength + 2;
  });
  //  Apply borders to all used cells
  const totalRows = worksheet.rowCount;
  const totalCols = headers.length;

  for (let i = 1; i <= totalRows; i++) {
    const row = worksheet.getRow(i);
    for (let j = 1; j <= totalCols; j++) {
      const cell = row.getCell(j);
      cell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" }
      };
    }
  }
  // Generate and save Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
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
  name,
  invoice_number,
  contact_number,
  address,
  gst_number,
  rows = [],
  payable_amount
) => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 5;
  const logoImage = "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";

  // Add company name and address as header
  const renderHeader = () => {
    // name
    doc.setFont("Roboto", "bold");
    doc.setFontSize(11);
    doc.text("HRUSHIKESH TANGADKAR", 14, 18);
    // gst in
    doc.setFont("Roboto", "normal");
    doc.setFontSize(11);
    doc.text("GSTIN: 27AADFZ9861FIZN", 14, 24);
    // contact no
    doc.setFont("Roboto", "normal");
    doc.setFontSize(11);
    doc.text("9665856368", 14, 30);

    // Add logo image centered instead of text "3_EXTENT"
    const logoWidth = 35;  // width in mm
    const logoHeight = 0; // height in mm
    const logoX = (pageWidth - logoWidth) / 2; // center horizontally
    const logoY = 18;  // vertical position
    doc.addImage(logoImage, "PNG", logoX, logoY, logoWidth, logoHeight);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(10);
    doc.text("3RD FLOOR, OFFICE NO. 310", pageWidth / 2, 54, { align: "center" });
    doc.text("DELUX FORTUNE MALL, PIMPRI, PUNE", pageWidth / 2, 58, { align: "center" });
    doc.text("NR KOTAK BANK OFFICE - 411018", pageWidth / 2, 62, { align: "center" });
    // Setup Y position
    let y = 70;
    // Customer Name
    doc.setFont("Roboto", "bold");
    doc.setFontSize(11);
    doc.text("Name:", 14, y);
    doc.setFont("Roboto", "normal");
    doc.setFont("Roboto", "normal");
    // Remove all spaces from the name
    const cleanedName = (name);
    // Wrap the name if it's too long
    const nameLines = doc.splitTextToSize(cleanedName, 100); // width can be adjusted
    nameLines.forEach((line, i) => {
      doc.text(
        line,
        14 + doc.getTextWidth("Name:") + 2,
        y + i * 6
      );
    });

    y += nameLines.length * 6;
    doc.setFont("Roboto", "bold");
    doc.text("Address:", 14, y);
    doc.setFont("Roboto", "normal");
    const cleanedAddress = address
      ?.replace(/\s+/g, " ")
      .replace(/[\n\r\t]+/g, "")
      .trim() || "-";

    let addressLines = doc.splitTextToSize(cleanedAddress, 100);
    addressLines.forEach((line, i) => {
      doc.text(
        line,
        14 + doc.getTextWidth("Address:") + 2,
        y + i * 6
      );
    });
    y += addressLines.length * 6;
    // GST No
    doc.setFont("Roboto", "bold");
    doc.text("GST No:", 14, y);
    doc.setFont("Roboto", "normal");
    doc.text(gst_number || "-", 14 + doc.getTextWidth("GST No:") + 2, y);
    // contact no and invoice number
    doc.setFont("Roboto", "bold");
    doc.text(`Invoice No : ${invoice_number}`, pageWidth - 26, 70, {
      align: "right",
    });
    doc.setFont("Roboto", "bold");
    doc.text(`Mob No: ${contact_number}`, pageWidth - 16, 76, {
      align: "right",
    });
    // date
    doc.text(`${new Date().toLocaleDateString("en-GB")}`, pageWidth - 14, 18, {
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
  const tableColumn = ["SR.NO", "PRODUCT DESCRIPTION", "IMEI NO", "GRADE", "AMOUNT"];
  const tableRows = rows.map((row, index) => {
    console.log('row: ', row);
    return [
      index + 1,
      `${row.Brand || row.model.brand.name || ""} ${row.Model || row.model.name || ""}`,
      row.imei_number || "",
      row.grade || "",
      Number(row.sold_at_price || 0).toFixed(2)
    ]
  });
  const totalRowIndex = tableRows.length;
  const capitalize = (str) => str.replace(/\b\w/g, char => char.toUpperCase());
  const amountInWordsRaw = toWords(payable_amount); // returns words with commas sometimes
  const amountInWordsClean = amountInWordsRaw.replace(/,/g, ""); // remove commas
  const amountInWords = `${capitalize(amountInWordsClean)} Only`;
  const formattedAmount = `Rs ${Number(payable_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  tableRows.push([
    {
      content: `Amount(In Words): ${amountInWords}`,
      colSpan: 3,
      styles: {
        halign: "left", fontStyle: "normal", fontSize: 11, cellWidth: 'wrap'
      },
    },
    {
      content: "TOTAL",
      styles: { halign: "right", fontStyle: "bold", fontSize: 11, },
    },
    {
      content: formattedAmount,
      styles: { halign: "right", fontStyle: "bold", fontSize: 11 }
    },
  ]);

  // Generate the table in the PDF
  let pageFinalYs = {};
  autoTable(doc, {
    startY: 92,
    head: [tableColumn],
    body: tableRows,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], halign: "left", fontStyle: "bold", },
    didDrawPage: (data) => {
      if (data.pageNumber === 1) renderHeader();
      drawPageBorder();
    },
    didDrawCell: (data) => {
      const { cell, row, section, } = data;

      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      pageFinalYs[pageNum] = Math.max(pageFinalYs[pageNum] || 0, cell.y + cell.height);

      doc.setDrawColor(0);
      doc.setLineWidth(0.3);

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
  const bottomY = pageHeight - 40; // Bottom margin
  // Set font for headings
  doc.setFontSize(11);
  doc.setFont("Roboto", "bold");
  doc.text("TERMS AND CONDITIONS:", 14, bottomY - 20);

  // Set font for the conditions
  doc.setFontSize(10);
  doc.setFont("Roboto", "normal");
  doc.text("1. Products once sold will neither be returned not exchanged.", 14, bottomY - 15);

  doc.setFontSize(11);
  doc.setFont("Roboto", "bold");
  doc.text("Receiver Signature", 14, bottomY + 10); // Left signature
  doc.text("Authorized Signature", pageWidth - margin - 50, bottomY + 10); // Right signature

  doc.setFontSize(10);
  doc.setFont("Roboto", "normal");
  doc.text("Thank you for your purchase!", pageWidth / 2, pageHeight - 15, { align: "center" });
  // Save the PDF file
  doc.save(`${name}__Invoice.pdf`);

};

export const excelDownload = () => {
  // Define headers
  const headers = [
    ["Model Name", "IMEI", "Purchase Price", "Sales Price", "Engineer Name", "QC Remark", "Supplier", "Accessories", "Grade"]
  ];

  // Create worksheet from headers
  const worksheet = XLSX.utils.aoa_to_sheet(headers);

  const headerRow = headers[0];

  // Set column widths based on header length
  worksheet['!cols'] = headerRow.map(header => ({
    wch: header.length + 2 // add a bit of padding
  }));

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write workbook with styles
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Trigger file download
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Download.xlsx");
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