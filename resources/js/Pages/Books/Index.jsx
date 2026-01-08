import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCard from '@/Components/BookCard';
import SearchBar from '@/Components/SearchBar';
import FilterDropdown from '@/Components/FilterDropdown';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, books, filters, categories }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleToggleRead = (bookId) => {
        router.post(route('books.toggle-read', bookId), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDeleteClick = (bookId) => {
        setBookToDelete(bookId);
        setConfirmingDelete(true);
    };

    const handleConfirmDelete = () => {
        if (bookToDelete) {
            setProcessing(true);
            router.delete(route('books.destroy', bookToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmingDelete(false);
                    setBookToDelete(null);
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            });
        }
    };

    const handleCancelDelete = () => {
        setConfirmingDelete(false);
        setBookToDelete(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Books</h2>
                    <Link href={route('books.create')}>
                        <PrimaryButton>Add New Book</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="My Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow">
                        <SearchBar initialValue={filters.search} />
                        <FilterDropdown categories={categories} filters={filters} />
                    </div>

                    {/* Books Grid */}
                    {books.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {books.data.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        onToggleRead={handleToggleRead}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {books.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {books.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                preserveState
                                                className={`px-4 py-2 border rounded-lg ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.search || filters.category || filters.status || filters.rating
                                    ? 'No books match your search criteria.'
                                    : 'Get started by adding a new book.'}
                            </p>
                            <div className="mt-6">
                                <Link href={route('books.create')}>
                                    <PrimaryButton>Add Your First Book</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={confirmingDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
