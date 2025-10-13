import { useEffect, useState } from 'react';
export default function CustomDropdownInputComponent({ name, dropdownClassName = "", labelClassName = "", placeholder = "", options = [], value = "", onChange = () => { }, maxLength, error }) {
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);
    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowDropdown(true);
        onChange(value);
    };
    const handleSelect = (option) => {
        setInputValue(option);
        onChange(option);
        setShowDropdown(false);
    };
    const filteredOptions = inputValue.trim() === ''
        ? options
        : options.filter(option =>
            typeof option === 'string' &&
            option.toLowerCase().includes(inputValue.toLowerCase())
        );
    return (
        <div className=" relative">
            <div><label className={`font-bold ${labelClassName} `}>{name}</label></div>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setShowDropdown(true)}   
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`px-3 py-2 border border-gray-300 rounded-md ${error ? 'border-red-600' : 'border-gray-300'} ${dropdownClassName}`}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <div className={`absolute z-10 mt-1 bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto ${dropdownClassName}`}>
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
            {error && <div className="text-red-600 mt-1 ml-1 text-sm">{error}</div>}
        </div>
    );
}
