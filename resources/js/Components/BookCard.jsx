import React from 'react';
import { Link, router } from '@inertiajs/react';
import StarRating from './StarRating';

export default function BookCard({ book, onToggleRead, onDelete }) {
    const placeholderImage = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Cover';

    const handleToggleRead = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleRead) {
            onToggleRead(book.id);
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
            onDelete(book.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <Link href={route('books.show', book.id)}>
                {/* Book Cover */}
                <div className="relative h-64 bg-gray-200">
                    <img
                        src={book.cover_image || placeholderImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = placeholderImage;
                        }}
                    />
                    {book.is_read && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Read
                        </span>
                    )}
                </div>

                {/* Book Details */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        by {book.author}
                    </p>

                    {book.category && (
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
                            {book.category.name}
                        </span>
                    )}

                    {book.rating && (
                        <div className="mb-3">
                            <StarRating rating={book.rating} readonly size="sm" />
                        </div>
                    )}

                    {book.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {book.description}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleToggleRead}
                            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                                book.is_read
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {book.is_read ? 'Mark Unread' : 'Mark as Read'}
                        </button>

                        <Link
                            href={route('books.edit', book.id)}
                            className="px-3 py-2 text-xs font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="px-3 py-2 text-xs font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
