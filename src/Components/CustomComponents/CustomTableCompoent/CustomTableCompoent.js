import { useState } from "react";
export default function CustomTableCompoent({ headers = [], rows = [] }) {
    const [tableHeaders, setTableHeaders] = useState([
        "No",
        "Supplier Name",
        "Company Name",
        "Address",
        "Contact 1",
        "Contact 2",
        "GST No",  
        "Email",
        "State",
        "Balance",
        "Supplier Type",    
    ])
    const [tableRows, setTableRows] = useState([
        "1",
        "nikita kadam",
        "Apple",
        "pune",
        "123456789",
    ])
    return (
        <div> 
            <table className="table-auto border border-slate-800 w-full">
                <tr className="bg-slate-800 text-white text-lg">
                    {tableHeaders.map((header, index) => (
                        <th key={index} className=" px-4 py-2">
                            {header}
                        </th>
                    ))}
                </tr>
                <tr className=" border-slate-800">
                    {tableRows.map((header, index) => (
                        <td key={index} className=" px-4 py-2">{header}</td>
                    ))}
                </tr>
            </table>
        </div>
    );
}


