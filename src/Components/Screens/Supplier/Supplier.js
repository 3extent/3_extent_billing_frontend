import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
function Supplier() {
    const headers = [
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
    ];
    const rows = [
        {
            "No": "1",
            "Supplier Name": "nikita kadam",
            "Company Name": "Apple",
            "Address": "pune",
            "Contact 1": "1234567890",
            "Contact 2": "1234568790",
            "GST No": "27ABCDE1234F1Z5",
            "Email": "abc@example.com",
            "state": "Maharastra",
            "Balance": "0",
            "Supplier Type": "wholesale",
        },
        {
            "No": "1",
            "Supplier Name": "nikita kadam",
            "Company Name": "Apple",
            "Address": "pune",
            "Contact 1": "1234567890",
            "Contact 2": "1234568790",
            "GST No": "27ABCDE1234F1Z5",
            "Email": "abc@example.com",
            "state": "Maharastra",
            "Balance": "0",
            "Supplier Type": "wholesale",
        }
    ];

    return (
        <div>
            <CustomTableCompoent
                headers={headers}
                rows={rows}
            />
        </div>
    );
}
export default Supplier;