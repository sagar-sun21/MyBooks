import { Link } from '@inertiajs/react';
import StarRating from './StarRating';

export default function BookCard({ book, onToggleRead, onDelete }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={route('books.show', book.id)}>
                <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 relative">
                    {book.cover_image ? (
                        <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-24 h-24 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                    )}
                    {book.is_read && (
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
                                Read
                            </span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-4">
                <Link href={route('books.show', book.id)}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                
                {book.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mb-2">
                        {book.category.name}
                    </span>
                )}
                
                {book.rating && (
                    <div className="mb-3">
                        <StarRating rating={book.rating} readonly size="sm" />
                    </div>
                )}
                
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onToggleRead(book.id)}
                        className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                        {book.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <Link
                        href={route('books.edit', book.id)}
                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-center"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}
