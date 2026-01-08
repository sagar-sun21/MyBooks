import React from 'react';
import InputLabel from './InputLabel';
import InputError from './InputError';

export default function ImageUpload({ label = 'Cover Image', value, onChange, error, currentImage = null }) {
    const [preview, setPreview] = React.useState(currentImage);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Pass file to parent
            if (onChange) {
                onChange(file);
            }
        }
    };

    const clearImage = () => {
        setPreview(null);
        if (onChange) {
            onChange(null);
        }
        // Reset file input
        const fileInput = document.getElementById('cover-image-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <InputLabel htmlFor="cover-image-input" value={label} />

            <div className="flex items-start gap-4">
                {/* Preview */}
                {preview && (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="w-32 h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* File Input */}
                <div className="flex-1">
                    <input
                        id="cover-image-input"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100
                            cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 2MB
                    </p>
                </div>
            </div>

            <InputError message={error} className="mt-2" />
        </div>
    );
}
