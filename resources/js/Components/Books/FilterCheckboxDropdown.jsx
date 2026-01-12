import { useState, useRef, useEffect } from 'react';

export default function FilterCheckboxDropdown({ label, values = [], onChange, options, placeholder = 'All' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (value) => {
        const newValues = values.includes(value)
            ? values.filter(v => v !== value)
            : [...values, value];
        onChange(newValues);
    };

    const getDisplayText = () => {
        if (values.length === 0) return placeholder;
        if (values.length === 1) {
            const selected = options.find(opt => opt.value === values[0]);
            return selected ? selected.label : placeholder;
        }
        return `${values.length} selected`;
    };

    return (
        <div ref={dropdownRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex justify-between items-center"
            >
                <span className={values.length === 0 ? 'text-gray-500 dark:text-gray-400' : ''}>
                    {getDisplayText()}
                </span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.length > 0 ? (
                        <>
                            {values.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onChange([])}
                                    className="w-full px-3 py-2 text-left text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600"
                                >
                                    Clear all
                                </button>
                            )}
                            {options.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={values.includes(option.value)}
                                        onChange={() => handleToggle(option.value)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </>
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
