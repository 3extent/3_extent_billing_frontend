
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