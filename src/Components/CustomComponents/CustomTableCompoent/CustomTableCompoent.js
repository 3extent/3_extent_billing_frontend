import { useEffect, useRef, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange, maxHeight = "h-full", onRowClick, editable = false, showTotalRow = false, autoScrollBottom = false, }) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    const tableRef = useRef(null);
    const lastRowRef = useRef(null)
    const Rows = tableRows && tableRows.length > 0;
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    useEffect(() => {
        if (autoScrollBottom && lastRowRef.current) {
            setTimeout(() => {
                lastRowRef.current.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }
    }, [tableRows]);
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
        <div ref={tableRef}
            className={`w-full  relative ${maxHeight} overflow-x-auto overflow-y-auto`}>
            {normalRows.length > 0 ? (
                <div className="border border-slate-800">
                    <table className="table-fixed w-full ">
                        <thead className=" sticky top-0 bg-slate-800 text-white text-sm font-semibold">
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
                                    ref={rowIndex === normalRows.length - 1 ? lastRowRef : null}
                                    className={`border-b border-slate-300 text-left text-[12px] ${onRowClick ? "cursor-pointer hover:bg-slate-100" : ""
                                        }`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {tableHeaders.map((header, colIndex) => (
                                        <td key={colIndex} className="px-4 py-2 text-left">
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
                                                row[header] !== undefined && row[header] !== null && row[header] !== ""
                                                    ? row[header]
                                                    : "-"
                                            )}
                                        </td>
                                    ))}
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
                                                : ["Total Amount", "Remaining Amount", "Profit", "Total Products", "Purchase Price", "Sale Price", "Rate"].includes(
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


