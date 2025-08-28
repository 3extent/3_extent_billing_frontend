import { useEffect, useState } from "react";
export default function CustomTableCompoent({ headers, rows, onRateChange,maxHeight="" }) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);

    useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    return (
        <div className="overflow-x-auto relative w-full">
            <div className="w-full table-fixed border border-slate-800">
                <table className="w-full table-fixed border border-slate-800">
                    <thead className="bg-slate-800 text-white text-base font-semibold">
                        <tr>
                            {tableHeaders.map((header, index) => (
                                <th key={index} className="px-4 py-2 text-center">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
                <div className={`overflow-y-auto border-x border-b border-slate-800 ${maxHeight}`}>
                    <table className="w-full table-fixed">
                        <tbody>
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
                        </tbody>
                        </table>
                        </div>
                </div>
            </div >
            );
}


