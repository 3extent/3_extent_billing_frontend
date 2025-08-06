
import { useState } from 'react';
export default function CustomDropdownInputComponent({label}) {
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const options = ['Apple', 'MI', 'Oppo'];
    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowDropdown(true);
    };
    const handleSelect = (option) => {
        setInputValue(option);
        setShowDropdown(false);
    };
    const filteredOptions = inputValue.trim() === ''
        ? options
        : options.filter(option =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        );
    return (
        <div className="w-[80%] relative">
            <label className="font-bold ">{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setShowDropdown(true)}  
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                placeholder="Enter a brand"
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
            />

            {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                            onMouseDown={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
