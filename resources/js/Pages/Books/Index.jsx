import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import BookCard from '@/Components/Books/BookCard';
import SearchBar from '@/Components/Books/SearchBar';
import FilterDropdown from '@/Components/Books/FilterDropdown';
import FilterCheckboxDropdown from '@/Components/Books/FilterCheckboxDropdown';
import ConfirmationModal from '@/Components/Books/ConfirmationModal';

export default function Index({ auth, books, categories, authors = [], filters }) {
    const [deleteModal, setDeleteModal] = useState({ show: false, bookId: null });
    const [processing, setProcessing] = useState(false);

    const handleSearch = (search) => {
        router.get(route('books.index'), { ...filters, search }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilter = (key, value) => {
        router.get(route('books.index'), { ...filters, [key]: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleMultiFilter = (key, values) => {
        const newFilters = { ...filters };
        if (values.length === 0) {
            delete newFilters[key];
        } else {
            newFilters[key] = values;
        }
        router.get(route('books.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleToggleRead = (bookId) => {
        router.patch(route('books.toggle-read', bookId), {}, {
            preserveState: true,
            only: ['books'],
        });
    };

    const handleDelete = (bookId) => {
        setDeleteModal({ show: true, bookId });
    };

    const confirmDelete = () => {
        if (deleteModal.bookId) {
            setProcessing(true);
            router.delete(route('books.destroy', deleteModal.bookId), {
                onFinish: () => {
                    setProcessing(false);
                    setDeleteModal({ show: false, bookId: null });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        My Books
                    </h2>
                    <Link
                        href={route('books.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Book
                    </Link>
                </div>
            }
        >
            <Head title="Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <SearchBar
                                    initialValue={filters.search}
                                    onSearch={handleSearch}
                                />
                            </div>
                            <FilterDropdown
                                label="Author"
                                value={filters.author}
                                onChange={(value) => handleFilter('author', value)}
                                options={authors.map(author => ({ value: author.id, label: author.name }))}
                                placeholder="All Authors"
                            />
                            <FilterCheckboxDropdown
                                label="Categories"
                                values={filters.categories || []}
                                onChange={(values) => handleMultiFilter('categories', values)}
                                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                placeholder="All Categories"
                            />
                            <FilterDropdown
                                label="Status"
                                value={filters.is_read}
                                onChange={(value) => handleFilter('is_read', value)}
                                options={[
                                    { value: '1', label: 'Read' },
                                    { value: '0', label: 'Unread' },
                                ]}
                                placeholder="All Status"
                            />
                        </div>
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
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {books.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {books.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-500 dark:text-indigo-200'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No books</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Get started by adding a new book to your collection.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('books.create')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Your First Book
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, bookId: null })}
                onConfirm={confirmDelete}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
                confirmText="Delete"
                isProcessing={processing}
            />
        </AuthenticatedLayout>
    );
}
