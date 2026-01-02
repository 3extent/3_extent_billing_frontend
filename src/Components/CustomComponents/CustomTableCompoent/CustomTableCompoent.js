import { useEffect, useRef, useState } from "react";

export default function CustomTableCompoent({
    headers,
    rows,
    onRateChange,
    maxHeight = "h-full",
    onRowClick,
    editable = false,
    showTotalRow = false,
    autoScrollBottom = false,
    toggleableColumns = [],
    hiddenColumns = [],
    onToggleColumn
}) {
    const [tableHeaders, setTableHeaders] = useState(headers);
    const [tableRows, setTableRows] = useState(rows);
    const [showDropdown, setShowDropdown] = useState(false);

    const tableRef = useRef(null);
    const lastRowRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => setTableHeaders(headers), [headers]);
    useEffect(() => setTableRows(rows), [rows]);

    const handleScroll = () => {
        const scrollElement = tableRef.current;
        if (!scrollElement) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
    };

    useEffect(() => {
        const scrollElement = tableRef.current;
        if (!scrollElement) return;

        scrollElement.addEventListener("scroll", handleScroll);
        return () => scrollElement.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (autoScrollBottom && isAtBottom && lastRowRef.current) {
            setTimeout(() => {
                lastRowRef.current.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }
    }, [tableRows, isAtBottom, autoScrollBottom]);

    const normalRows = tableRows.filter((row) => row._id !== "total");
    const totalRowData = tableRows.find((row) => row._id === "total");

    const getTotalRowBg = () => {
        if (!totalRowData) return "bg-white";
        if (totalRowData.Profit != null) {
            if (totalRowData.Profit > 0) return "bg-green-200";
            if (totalRowData.Profit < 0) return "bg-red-200";
        }
        return "bg-green-200";
    };

    return (
        <div>
            {/* Toggleable Columns Dropdown */}
            {toggleableColumns.length > 0 && tableRows.length > 0 && (
                <div className="w-full flex justify-start bg-white py-2 pl-2 top-0 z-30">
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
                                        />
                                        {col}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table Body */}
            <div className={`w-full relative ${maxHeight} overflow-x-auto`}>
                {tableRows.length > 0 ? (
                    <div
                        ref={tableRef}
                        className={`w-full relative ${maxHeight} overflow-x-auto overflow-y-auto`}
                    >
                        {normalRows.length > 0 ? (
                            <div className="border border-slate-800">
                                <table className="table-fixed w-full">
                                    <thead className="sticky top-0 bg-slate-800 text-white text-sm font-semibold">
                                        <tr>
                                            {tableHeaders.map((header, i) => (
                                                <th
                                                    key={i}
                                                    className={`px-4 py-2 ${header === "Action"
                                                            ? "text-right"
                                                            : "text-left"
                                                        }`}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableRows.map((row, rowIndex) => (
                                            <tr
                                                key={rowIndex}
                                                ref={
                                                    rowIndex === tableRows.length - 1
                                                        ? lastRowRef
                                                        : null
                                                }
                                                className={`border-b text-left text-[12px] ${row.is_repaired
                                                        ? "bg-red-100 hover:bg-red-300"
                                                        : "border-slate-300 hover:bg-slate-100"
                                                    } ${onRowClick ? "cursor-pointer " : ""
                                                    }`}
                                                onClick={() => onRowClick && onRowClick(row)}
                                            >
                                                {tableHeaders.map((header, colIndex) => (
                                                    <td
                                                        key={colIndex}
                                                        className="px-4 py-2 text-left"
                                                    >
                                                        {editable && header === "Rate" && row.status !== "SOLD" ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    row[header] === 0
                                                                        ? ""
                                                                        : row[header]
                                                                }
                                                                onChange={(e) =>
                                                                    onRateChange(
                                                                        rowIndex,
                                                                        e.target.value === ""
                                                                            ? ""
                                                                            : Number(e.target.value)
                                                                    )
                                                                }
                                                                className="border border-gray-300 px-2 py-1 w-24"
                                                            />
                                                        ) : (
                                                            row[header] ?? "-"
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
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-red-600 font-bold text-[25px] text-center">
                        No Records Found
                    </div>
                )}

                {/* Total Row */}
                {totalRowData && showTotalRow && (
                    <div
                        className={`mt-5 sticky bottom-0 font-extrabold text-[20px] z-20 ${getTotalRowBg()}`}
                    >
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full">
                                <tbody>
                                    <tr>
                                        {tableHeaders.map((header, index) => (
                                            <td key={index} className="px-4 py-2 text-left">
                                                {header === "Bill id" || header === "Sr.No"
                                                    ? "Total"
                                                    : [
                                                        "Total Amount",
                                                        "Remaining Amount",
                                                        "Profit",
                                                        "Total Products",
                                                        "Purchase Price",
                                                        "Sale Price",
                                                        "Rate"
                                                    ].includes(header)
                                                        ? totalRowData[header]?.toLocaleString()
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
        </div>
    );
}
