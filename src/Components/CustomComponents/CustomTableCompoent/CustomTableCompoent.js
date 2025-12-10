import { useEffect, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange, maxHeight = "h-full", onRowClick, editable = false, showTotalRow = false, totalRow,
    toggleableColumns = [],
    hiddenColumns = [],
    onToggleColumn
}) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    const [showDropdown, setShowDropdown] = useState(false);
    const Rows = tableRows && tableRows.length > 0;
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    const getTotalRowBg = () => {
        if (!totalRow) return "bg-white";
        if (totalRow.Profit != null) {
            if (totalRow.Profit > 0) return "bg-green-200";
            if (totalRow.Profit < 0) return "bg-red-200";
        }
        return "bg-green-200";
    };
    return (
        <div>
            {toggleableColumns.length > 0 && tableRows.length > 0 && (
                <div className="w-full flex justify-start bg-white py-2 pl-2 sticky top-0 z-30">
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                            <i className="fa fa-ellipsis-h"></i>
                        </button>

                        {showDropdown && (
                            <div className="absolute left-0 bg-white border rounded shadow-md mt-1 w-48 z-40">
                                {toggleableColumns.map((col) => (
                                    <label
                                        key={col}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!hiddenColumns.includes(col)}
                                            onChange={() => onToggleColumn(col)}
                                            className="mr-2"
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                                        />
                                        {col}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

        <div className={`w-full relative ${maxHeight} overflow-x-auto`}>
            {/* {toggleableColumns.length > 0 && tableRows.length > 0 && (
                <div className="w-full flex justify-start bg-white py-2 pl-2 sticky top-0 z-30">
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                            <i className="fa fa-ellipsis-h"></i>
                        </button>

                        {showDropdown && (
                            <div className="absolute left-0 bg-white border rounded shadow-md mt-1 w-48 z-40">
                                {toggleableColumns.map((col) => (
                                    <label
                                        key={col}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!hiddenColumns.includes(col)}
                                            onChange={() => onToggleColumn(col)}
                                            className="mr-2"
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                                        />
                                        {col}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )} */}
            {tableRows.length > 0 ? (
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
                            {tableRows.map((row, rowIndex) => {
                                console.log('row: ', row);

                                return <tr key={rowIndex}
                                    className={`border-b border-slate-300 text-left text-[12px] ${onRowClick ? "cursor-pointer hover:bg-slate-100" : ""
                                        }`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {tableHeaders.map((header, colIndex) => (
                                        <td key={colIndex} className="px-4 py-2 text-left">
                                            {editable && header === "Rate" && row["status"] !== "SOLD" ? (
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
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full w-full text-red-600 font-bold text-[25px] text-center">
                    No Records Found
                </div>
            )
            }
            {
                totalRow && tableRows.length > 0 && showTotalRow && (
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
                                                        header)
                                                        ? 
                                                        totalRow[header]?.toLocaleString()
                                                        : ""
                                                        }
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
        </div>
    );
}


