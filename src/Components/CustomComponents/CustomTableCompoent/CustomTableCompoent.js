import { useEffect, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange, maxHeight = "", onRowClick, editable = false }) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    const Rows = tableRows && tableRows.length > 0;
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    return (
        <div className={`w-full overflow-x-auto relative ${maxHeight ? maxHeight : "max-h-[75vh]"}`}>
            {Rows ? (
                <div className="border border-slate-800">
                    <table className="table-fixed w-full ">
                        <thead className=" sticky top-0 bg-slate-800 text-white text-sm font-semibold">
                            <tr>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="px-4 py-2 text-left ">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody >
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}
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
                <div className="text-red-600 font-bold text-[25px] text-center mt-4">
                    No Records Found
                </div>
            )}
        </div>
    );
}


