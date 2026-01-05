
import ExcelJS from "exceljs";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { LOGO_BASE64 } from "./AppConst";
import { ToWords } from "to-words";
export const exportToExcel = async (data, fileName = "StyledData.xlsx", customerInfo = null , visibleColumns = null) => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  
   let headers = visibleColumns 
    ? visibleColumns.filter(header => !["Action", "Actions"].includes(header)) 
    : Object.keys(data[0]).filter(header => !["id","Actions","Action"].includes(header));

  let rowIndex = 1;
  worksheet.mergeCells(rowIndex, 1, rowIndex + 1, headers.length);
  const titleCell = worksheet.getCell(`A${rowIndex}`);
  titleCell.value = "3 EXTENT";
  titleCell.font = { bold: true, name: "Times New Roman", color: { argb: "FFFAA500" }, size: 18 };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  rowIndex += 2
  // customer info
  if (customerInfo) {
    worksheet.mergeCells(rowIndex, 1, rowIndex + 3, headers.length);
    const customerCell = worksheet.getCell(`A${rowIndex}`);

    customerCell.value =
      `Customer Name: ${customerInfo?.name || ""}\n` +
      `Contact Number: ${customerInfo?.contact || ""}\n` +
      `Firm Name: ${customerInfo?.firmname || ""}\n` +
      `Date: ${customerInfo?.date || ""}`;

    customerCell.font = { bold: false, size: 12 };
    customerCell.alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true
    };

    rowIndex += 4;;
  }
  // 3: Date row
  worksheet.mergeCells(rowIndex, 1, rowIndex, headers.length);
  const dateCell = worksheet.getCell(`A${rowIndex}`);
  dateCell.value = `Date: ${new Date().toLocaleDateString()}`;
  dateCell.font = { italic: true, color: { argb: "FFFAA500" } };
  dateCell.alignment = { horizontal: "left" };
  rowIndex++;
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
  worksheet.columns.forEach((col, index) => {
    let maxLength = 10;
    const columnData = [
      headers[index],
      ...data.map((row) => (row[headers[index]] || "").toString())
    ];

    columnData.forEach((value) => {
      maxLength = Math.max(maxLength, value.length);
    });
    col.width = maxLength + 2;
  });
  //  Apply borders to all used cells
  const totalRows = worksheet.rowCount;
  const totalCols = rowIndex;

  for (let i = totalCols; i <= totalRows; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" }
      };
    })
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
  payable_amount,
  firm_name,
  net_total,
  c_gst,
  s_gst
) => {
  console.log("Firm Name:", firm_name);
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}_${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`;
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 5;

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
    doc.addImage(LOGO_BASE64, "PNG", logoX, logoY, logoWidth, logoHeight);
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
    y += 6;


    doc.setFont("Roboto", "bold");
    doc.text("Firm Name:", 14, y);
    doc.setFont("Roboto", "normal");
    doc.text(firm_name || "-", 14 + doc.getTextWidth("Firm Name:") + 2, y);

    // contact no and invoice number
    const rightMargin = 16;
    doc.setFont("Roboto", "bold");
    doc.text(`Invoice No : ${invoice_number}`, pageWidth - rightMargin, 70, {
      align: "right",
    });
    // Mobile No (below Invoice No)
    doc.text(`Mob No: ${contact_number}`, pageWidth - rightMargin, 76, {
      align: "right",
    });
    // date
    doc.text(
      now.toLocaleDateString("en-GB"),
      pageWidth - 14,
      18,
      { align: "right" }
    );
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
  const MIN_VISIBLE_ROWS = 8;
  if (tableRows.length < MIN_VISIBLE_ROWS) {
    const emptyRowsNeeded = MIN_VISIBLE_ROWS - tableRows.length;
    for (let i = 0; i < emptyRowsNeeded; i++) {
      tableRows.push(["", "", "", "", ""]);
    }
  }
  const toWords = new ToWords({
    localeCode: "en-IN",       // Indian format
    converterOptions: {
      currency: false,
      ignoreDecimal: true,
      ignoreZeroCurrency: false,
    }
  });
  const totalRowIndex = tableRows.length;
  const capitalize = (str) => str.replace(/\b\w/g, char => char.toUpperCase());
  const amountInWordsRaw = toWords.convert(payable_amount);
  const amountInWordsClean = amountInWordsRaw.replace(/,/g, ""); // remove commas
  const amountInWords = `${capitalize(amountInWordsClean)} Only`;
  const formattedAmount = `Rs ${Number(payable_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const formattedNetTotal = `Rs ${Number(net_total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const formattedSGST = Number(s_gst).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const formattedCGST = Number(c_gst).toLocaleString("en-IN", { minimumFractionDigits: 2 });
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
      styles: {
        halign: "right", fontStyle: "bold", fontSize: 11, lineWidth: { bottom: 0.2 }, lineColor: { bottom: 0 },
      },
    },
    {
      content: formattedAmount,
      styles: {
        halign: "right", fontStyle: "bold", fontSize: 11, lineWidth: { bottom: 0.2 },
        lineColor: { bottom: 0 }
      },
    },
  ]);
  tableRows.push([
    { content: "", colSpan: 3, styles: { halign: "left" } },
    { content: "SGST(9%)", styles: { halign: "right", fontStyle: "normal", fontSize: 9 } },
    { content: formattedSGST, styles: { halign: "right", fontStyle: "normal", fontSize: 9 } },
  ]);

  // ROW 3 → CGST
  tableRows.push([
    { content: "", colSpan: 3, styles: { halign: "left" } },
    { content: "CGST(9%)", styles: { halign: "right", fontStyle: "normal", fontSize: 9 } },
    { content: formattedCGST, styles: { halign: "right", fontStyle: "normal", fontSize: 9 } },
  ]);

  // ROW 4 → Net Total
  tableRows.push([
    { content: "", colSpan: 3, styles: { halign: "left" } },
    {
      content: "Net Total", styles: {
        halign: "right", fontStyle: "bold", fontSize: 11, lineWidth: { top: 0.2 },
        lineColor: { top: 0 }
      }
    },
    {
      content: formattedNetTotal, styles: {
        halign: "right", fontStyle: "bold", fontSize: 11, lineWidth: { top: 0.2 },
        lineColor: { top: 0 }
      }
    },
  ]);

  //  Add Terms and Signature rows to the table
  tableRows.push([
    {
      content: "TERMS AND CONDITIONS:",
      colSpan: 5,
      styles: {
        halign: "left", fontStyle: "bold", fontSize: 11, cellPadding: 2
      },
    },
  ]);

  tableRows.push([
    {
      content: "1. Products once sold will neither be returned nor exchanged.",
      colSpan: 5,
      styles: {
        halign: "left", fontStyle: "normal", fontSize: 10, cellPadding: 2
      },
    },
  ]);

  const signatureRowIndex = tableRows.length;
  tableRows.push([
    {
      content: "Receiver Signature",
      colSpan: 2,
      styles: {
        halign: "left", fontStyle: "bold", fontSize: 11, cellPadding: { top: 15, left: 15, bottom: 2 }
      },
    },

    {
      content: "Authorized Signature",
      colSpan: 3,
      styles: {
        halign: "right", fontStyle: "bold", fontSize: 11, cellPadding: { top: 15, right: 15, bottom: 2 }
      },
    }
  ]);
  // Generate the table in the PDF
  let pageFinalYs = {};
  autoTable(doc, {
    startY: 96,
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
      const isNetTotalRow = section === "body" && row.index === totalRowIndex + 3;
      const isSignatureRow = section === "body" && row.index === signatureRowIndex;

      //  Draw only left & right lines (NO top/bottom)
      doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // Left
      doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // Right

      //  TOTAL row: top & bottom border
      if (isTotalRow) {
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
      }
      // NET Total: bottom border
      if (isNetTotalRow) {
        doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
      }
      if (isSignatureRow) {
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // Top
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
  // save file
  doc.save(`${name}_Invoice_${timestamp}.pdf`);
};

export const excelDownload = () => {
  // Define headers
  const headers = [
    ["Brand Name", "Model Name", "IMEI", "Purchase Price", "Sales Price", "Engineer Name", "QC Remark", "Supplier", "Accessories", "Grade"]
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

export const handleBarcodePrint = (products) => {
  console.log("products", products);

  // Ensure products is an array
  const productsArray = Array.isArray(products) ? products : [products];

  if (productsArray.length === 0) {
    alert("No barcodes to print!");
    return;
  }

  const win = window.open('', '', 'height=900,width=1200');
  const safeData = JSON.stringify(productsArray);

  win.document.write(`
    <html>
      <head>
        <title>Print Barcodes</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: "Courier New", Courier, monospace;
          }
          .grid {
            display: block;
          }
          .item {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            page-break-after: always;
            page-break-inside: avoid;
          }
          .item:last-child {
            page-break-after: auto;
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
        <div class="grid" id="barcodes"></div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          (function(){
            try {
              var data = ${safeData};
              var container = document.getElementById('barcodes');
              data.forEach(function(item, idx){
                var code = String(item.imei_number || item.imei || item.code || '');
                if (!code) return;
                var modelName = item.modelName || (item.model && item.model.name) || '';
                var grade = item.grade || '';

                var wrapper = document.createElement('div');
                wrapper.className = 'item';
                var svgId = 'bc_' + idx;
                wrapper.innerHTML = '<h1 class="h2">' + (modelName || '') + '</h1>' +
                  '<h1 class="h2">Grade : ' + (grade || '') + '</h1>' +
                  '<svg id="' + svgId + '"></svg>';
                container.appendChild(wrapper);
                JsBarcode('#' + svgId, code, {
                  format: 'CODE128',
                  lineColor: '#000',
                  width: 2,
                  height: 40,
                  displayValue: true,
                  fontSize: 30
                });
              });
              window.onload = function() {
                window.print();
              };
            } catch (e) {
              console.error(e);
              alert('Failed to render barcodes');
            }
          })();
        </script>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
};

export const handleMultipleBarcodesPrint = (products = []) => {
  if (!Array.isArray(products) || products.length === 0) {
    alert("No barcodes to print!");
    return;
  }
  const win = window.open('', '', 'height=900,width=1200');
  const safeData = JSON.stringify(products);
  win.document.write(`
    <html>
      <head>
        <title>Print Barcodes</title>
        <style>
          @page { size: A4; margin: 10mm; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: Arial, Helvetica, sans-serif; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; align-items: start; }
          .item { border: 1px dashed #ccc; padding: 8px; page-break-inside: avoid; }
          .title { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; }
          .meta { margin: 0 0 6px 0; font-size: 12px; font-weight: 600; }
          svg { width: 100%; height: 70px; }
          .value { text-align: left; font-size: 12px; margin-top: 2px; }
        </style>
      </head>
      <body>
        <div class="grid" id="barcodes"></div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          (function(){
            try {
              var data = ${safeData};
              var container = document.getElementById('barcodes');
              data.forEach(function(item, idx){
                var code = String(item.imei_number || item.imei || item.code || '');
                if (!code) return;
                var modelName = item.modelName || (item.model && item.model.name) || '';
                var brandName = (item.Brand || (item.model && item.model.brand && item.model.brand.name)) || '';
                var grade = item.grade || '';

                var wrapper = document.createElement('div');
                wrapper.className = 'item';
                var svgId = 'bc_' + idx;
                wrapper.innerHTML = '<p class="title">' + (brandName ? (brandName + ' ') : '') + (modelName || '') + '</p>' +
                  (grade ? ('<p class="meta">Grade: ' + grade + '</p>') : '') +
                  '<svg id="' + svgId + '"></svg>';
                container.appendChild(wrapper);
                JsBarcode('#' + svgId, code, {
                  format: 'CODE128',
                  lineColor: '#000',
                  width: 2,
                  height: 60,
                  displayValue: true,
                  fontSize: 12,
                  textMargin: 2,
                });
              });
              window.onload = function(){ window.print(); };
            } catch (e) {
              console.error(e);
              alert('Failed to render barcodes');
            }
          })();
        </script>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
};
