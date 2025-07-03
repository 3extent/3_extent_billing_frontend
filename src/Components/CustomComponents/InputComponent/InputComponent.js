function InputComponent() {
    return (
        <div>
            <div className="text-left">
                <label>Mobile Number:</label><br />
                <input className="w-full border px-3 py-2 rounded" type="text" placeholder="Mobile Number" />
            </div>
            <div className="text-left">
                <label>Password:</label><br />
                <input className="w-full border px-3 py-2 rounded" type="text" placeholder="Password" />
            </div>
        </div>

    );
} export default InputComponent;