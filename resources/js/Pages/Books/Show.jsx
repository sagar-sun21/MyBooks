import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import StarRating from '@/Components/Books/StarRating';
import ConfirmationModal from '@/Components/Books/ConfirmationModal';

export default function Show({ auth, book }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('books.destroy', book.id), {
            onFinish: () => setProcessing(false),
        });
    };

    const handleToggleRead = () => {
        router.patch(route('books.toggle-read', book.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Book Details
                    </h2>
                    <Link
                        href={route('books.index')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        Back to Books
                    </Link>
                </div>
            }
        >
            <Head title={book.title} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Book Cover */}
                                <div className="md:col-span-1">
                                    <div className="sticky top-6">
                                        {book.cover_image ? (
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="w-full rounded-lg shadow-lg"
                                            />
                                        ) : (
                                            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
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

                                        {/* Action Buttons */}
                                        <div className="mt-6 space-y-3">
                                            <button
                                                onClick={handleToggleRead}
                                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                            >
                                                {book.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                            </button>
                                            <Link
                                                href={route('books.edit', book.id)}
                                                className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-center"
                                            >
                                                Edit Book
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(true)}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                            >
                                                Delete Book
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Book Details */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Title and Status */}
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {book.title}
                                            </h1>
                                            {book.is_read && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                    Read
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                                            by {book.author}
                                        </p>
                                    </div>

                                    {/* Category */}
                                    {book.category && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Category
                                            </h3>
                                            <span className="mt-1 inline-block px-3 py-1 text-sm font-medium rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                                {book.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* ISBN */}
                                    {book.isbn && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                ISBN
                                            </h3>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {book.isbn}
                                            </p>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    {book.rating && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                                                Rating
                                            </h3>
                                            <StarRating rating={book.rating} readonly size="lg" />
                                        </div>
                                    )}

                                    {/* Description */}
                                    {book.description && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Description
                                            </h3>
                                            <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {book.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Personal Notes */}
                                    {book.notes && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Personal Notes
                                            </h3>
                                            <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {book.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Added on:</span>
                                                <span className="ml-2 text-gray-900 dark:text-white">
                                                    {new Date(book.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Last updated:</span>
                                                <span className="ml-2 text-gray-900 dark:text-white">
                                                    {new Date(book.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                confirmText="Delete"
                isProcessing={processing}
            />
        </AuthenticatedLayout>
    );
}
