import { useState, useRef } from 'react';

export default function ImageUpload({ value, onChange, error, existingImage = null }) {
    const [preview, setPreview] = useState(existingImage);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Cover
            </label>
            
            {preview ? (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Book cover preview"
                        className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center w-48 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Click to upload cover
                        </p>
                    </div>
                </div>
            )}
            
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/heic,image/heif"
                className="hidden"
            />
            
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, WEBP, HEIC, HEIF up to 6MB
            </p>
        </div>
    );
}
