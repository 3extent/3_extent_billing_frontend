import { useState } from "react";
export default function CustomTableCompoent({ headers,rows}) {
    const [tableHeaders, setTableHeaders] = useState(headers)
    const [tableRows, setTableRows] = useState(rows)
    return (
        <div className="overflow-x-auto"> 
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
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
            </table>
        </div>
    );
}


