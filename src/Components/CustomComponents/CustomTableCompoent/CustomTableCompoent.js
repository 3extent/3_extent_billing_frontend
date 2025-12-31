import { useEffect, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange, maxHeight = "h-full", onRowClick, editable = false, showTotalRow = false }) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    const Rows = tableRows && tableRows.length > 0;
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    const normalRows = tableRows.filter(row => row._id !== "total");
    const totalRow = tableRows.find(row => row._id === "total");
    const getTotalRowBg = () => {
        if (!totalRow) return "bg-white";
        if (totalRow.Profit != null) {
            if (totalRow.Profit > 0) return "bg-green-200";
            if (totalRow.Profit < 0) return "bg-red-200";
        }
        return "bg-green-200";
    };
    return (
        <div className={`w-full  relative ${maxHeight} overflow-x-auto`}>
            {normalRows.length > 0 ? (
                <div className="border border-slate-800">
                    <table className="table-fixed w-full ">
                        <thead className="sticky top-0 bg-slate-800 text-white text-sm font-semibold">
                            <tr>
                                {tableHeaders.map((header, index) => (
                                    <th key={index}
                                        className={`px-4 py-2 ${header === "Action" ? "text-right" : "text-left"}`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody >
                            {normalRows.map((row, rowIndex) => (
                                <tr key={rowIndex}
                                    className={`border-b text-left text-[12px]
                                          ${row.is_repaired ? "bg-red-100 hover:bg-red-300" : "border-slate-300 hover:bg-slate-100"}
                                        ${onRowClick ? "cursor-pointer " : ""
                                        }`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {tableHeaders.map((header, colIndex) => {
                                        console.log('header: ', header);
                                        console.log('row[header]: ', row[header]);
                                        return <td key={colIndex} className={`px-4 py-2 ${header === "Action" ? "text-right" : "text-left"}`}>
                                            {editable && header === "Rate" ? (
                                                <input
                                                    type="type"
                                                    value={row[header] === 0 ? "" : row[header]}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        onRateChange(rowIndex, value === "" ? "" : Number(value));
                                                    }}
                                                    className="border border-gray-300 px-2 py-1 w-24 "
                                                />
                                            ) : (
                                                row[header]
                                                    ? row[header]
                                                    : "-"
                                            )}
                                        </td>
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full w-full text-red-600 font-bold text-[25px] text-center">
                    No Records Found
                </div>
            )}
            {totalRow && normalRows.length > 0 && showTotalRow && (
                <div className={`mt-5 sticky bottom-0 font-extrabold text-[20px] z-20  ${getTotalRowBg()}`}>
                    <div className="overflow-x-auto">
                        <table className="table-fixed w-full">
                            <tbody>
                                <tr>
                                    {tableHeaders.map((header, index) => (
                                        <td
                                            key={index}
                                            className="px-4 py-2 text-left "
                                        >
                                            {header === "Bill id" || header === "Sr.No"
                                                ? "Total"
                                                : ["Total Amount", "Remaining Amount", "Profit", "Total Products", "Purchase Price", "Sale Price", "Rate", "Part Cost", "Repairer Cost", "Total Paid", "Total Repairer Remaining", "Total Part Cost", "Total Repairer Cost",].includes(
                                                    header
                                                )
                                                    ? totalRow[header].toLocaleString()
                                                    : ""}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}


