import React from 'react';

export default function StarRating({ rating, setRating, readonly = false, size = 'md' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const handleClick = (value) => {
        if (!readonly && setRating) {
            setRating(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    disabled={readonly}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <svg
                        className={`${sizeClasses[size]} ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                </button>
            ))}
            {!readonly && rating > 0 && (
                <button
                    type="button"
                    onClick={() => handleClick(0)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
