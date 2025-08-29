import { useEffect, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange }) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    const rows = tableRows && tableRows.length > 0;

    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    return (
        <div className="overflow-x-auto">
            {rows ? (
                <table className="table border border-slate-800 w-full">
                    <tr className="bg-slate-800 text-white text-lg font-semibold">
                        {tableHeaders.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-center">
                                {header}
                            </th>
                        ))}
                    </tr>

                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-slate-300">
                            {tableHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 text-center">
                                    {header === "Rate" ? (
                                        <input
                                            type="number"
                                            value={row[header] === 0 ? "" : row[header]}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                onRateChange(rowIndex, value === "" ? "" : Number(value));
                                            }}
                                            className="border border-gray-300 px-2 py-1 w-24"
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
                </table>
            ) : (
                <div className="text-red-600 font-bold text-[25px] text-center mt-4">
                 No Records Found
                </div>
            )}
        </div>
    );
}


