import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StarRating from '@/Components/StarRating';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Show({ auth, book }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const placeholderImage = 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Cover';

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('books.destroy', book.id), {
            onSuccess: () => {
                setConfirmingDelete(false);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleToggleRead = () => {
        router.post(route('books.toggle-read', book.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Book Details</h2>
                    <Link
                        href={route('books.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Books
                    </Link>
                </div>
            }
        >
            <Head title={book.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Book Cover */}
                                <div className="md:col-span-1">
                                    <img
                                        src={book.cover_image || placeholderImage}
                                        alt={book.title}
                                        className="w-full rounded-lg shadow-lg"
                                        onError={(e) => {
                                            e.target.src = placeholderImage;
                                        }}
                                    />
                                    
                                    {/* Action Buttons */}
                                    <div className="mt-4 space-y-2">
                                        <button
                                            onClick={handleToggleRead}
                                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                                                book.is_read
                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                        >
                                            {book.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                        </button>
                                        
                                        <Link
                                            href={route('books.edit', book.id)}
                                            className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                                        >
                                            Edit Book
                                        </Link>
                                        
                                        <button
                                            onClick={() => setConfirmingDelete(true)}
                                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                                        >
                                            Delete Book
                                        </button>
                                    </div>
                                </div>

                                {/* Book Details */}
                                <div className="md:col-span-2 space-y-4">
                                    {/* Title and Author */}
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                        <p className="text-xl text-gray-600">by {book.author}</p>
                                    </div>

                                    {/* Status Badge */}
                                    {book.is_read && (
                                        <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                                            Read
                                        </span>
                                    )}

                                    {/* Category */}
                                    {book.category && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Category</h3>
                                            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                                                {book.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* ISBN */}
                                    {book.isbn && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">ISBN</h3>
                                            <p className="text-gray-600">{book.isbn}</p>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    {book.rating && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">My Rating</h3>
                                            <StarRating rating={book.rating} readonly size="lg" />
                                        </div>
                                    )}

                                    {/* Description */}
                                    {book.description && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{book.description}</p>
                                        </div>
                                    )}

                                    {/* Personal Notes */}
                                    {book.notes && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">My Notes</h3>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <p className="text-gray-700 whitespace-pre-wrap">{book.notes}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Added on:</span>
                                                <span className="ml-2 text-gray-700">
                                                    {new Date(book.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Last updated:</span>
                                                <span className="ml-2 text-gray-700">
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

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={confirmingDelete}
                onClose={() => setConfirmingDelete(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
