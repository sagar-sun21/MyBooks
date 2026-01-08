import React from 'react';
import { router } from '@inertiajs/react';

export default function FilterDropdown({ categories = [], filters = {} }) {
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        
        // Remove empty filters
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k]) delete newFilters[k];
        });

        router.get(route('books.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route('books.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = filters.category || filters.status !== undefined || filters.rating;

    return (
        <div className="flex flex-wrap gap-4 items-end">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                </label>
                <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Read Status
                </label>
                <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">All Books</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                </select>
            </div>

            {/* Rating Filter */}
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Rating
                </label>
                <select
                    value={filters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Any Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <div>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
