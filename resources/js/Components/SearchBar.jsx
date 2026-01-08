import React from 'react';
import { router } from '@inertiajs/react';

export default function SearchBar({ initialValue = '', onSearch }) {
    const [search, setSearch] = React.useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(search);
        } else {
            router.get(route('books.index'), { search }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleClear = () => {
        setSearch('');
        if (onSearch) {
            onSearch('');
        } else {
            router.get(route('books.index'), { search: '' }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                {search && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
}
