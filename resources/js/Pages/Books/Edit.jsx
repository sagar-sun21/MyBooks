import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import StarRating from '@/Components/Books/StarRating';
import ImageUpload from '@/Components/Books/ImageUpload';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, book, categories, authors = [] }) {
    const [isAuthorOther, setIsAuthorOther] = useState(false);
    const [authorsList, setAuthorsList] = useState(authors);

    // Get initial category IDs from book's categories
    const initialCategoryIds = book.categories?.map(c => c.id) || [];
    // Check if author is in the existing list
    const initialAuthorId = book.author_id || '';

    const { data, setData, post, processing, errors } = useForm({
        title: book.title || '',
        author_id: initialAuthorId,
        author: '',
        isbn: book.isbn || '',
        description: book.description || '',
        cover_image: null,
        category_ids: initialCategoryIds,
        is_read: book.is_read || false,
        rating: book.rating || 0,
        notes: book.notes || '',
        _method: 'PUT',
    });

    useEffect(() => {
        if (data.author_id && data.author_id !== 'other') {
            setIsAuthorOther(false);
        }
    }, [data.author_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('books.update', book.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Book
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
            <Head title={`Edit ${book.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <InputLabel htmlFor="title" value="Title *" />
                                        <TextInput
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>

                                    {/* Author */}
                                    <div>
                                        <InputLabel htmlFor="author_id" value="Author *" />
                                        <select
                                            id="author_id"
                                            value={data.author_id}
                                            onChange={(e) => {
                                                if (e.target.value === 'other') {
                                                    setIsAuthorOther(true);
                                                    setData('author_id', 'other');
                                                    setData('author', '');
                                                } else {
                                                    setIsAuthorOther(false);
                                                    setData('author_id', e.target.value);
                                                    const selectedAuthor = authorsList.find(a => a.id === parseInt(e.target.value));
                                                    if (selectedAuthor) {
                                                        setData('author', selectedAuthor.name);
                                                    }
                                                }
                                            }}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select an author</option>
                                            {authorsList.map((author) => (
                                                <option key={author.id} value={author.id}>
                                                    {author.name}
                                                </option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        <InputError message={errors.author_id || errors.author} className="mt-2" />
                                    </div>

                                    {/* Author Input (shown when "Other" is selected) */}
                                    {isAuthorOther && (
                                        <div>
                                            <InputLabel htmlFor="author" value="New Author Name *" />
                                            <TextInput
                                                id="author"
                                                type="text"
                                                value={data.author}
                                                onChange={(e) => setData('author', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Enter new author name"
                                                required
                                            />
                                            <InputError message={errors.author} className="mt-2" />
                                        </div>
                                    )}

                                    {/* ISBN */}
                                    <div>
                                        <InputLabel htmlFor="isbn" value="ISBN" />
                                        <TextInput
                                            id="isbn"
                                            type="text"
                                            value={data.isbn}
                                            onChange={(e) => setData('isbn', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.isbn} className="mt-2" />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <InputLabel value="Categories" />
                                        <div className="mt-2 space-y-2 p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <label key={category.id} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={category.id}
                                                            checked={data.category_ids.includes(category.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setData('category_ids', [...data.category_ids, parseInt(e.target.value)]);
                                                                } else {
                                                                    setData('category_ids', data.category_ids.filter(id => id !== parseInt(e.target.value)));
                                                                }
                                                            }}
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                            {category.name}
                                                        </span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No categories available</p>
                                            )}
                                        </div>
                                        <InputError message={errors.category_ids} className="mt-2" />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <InputLabel htmlFor="notes" value="Personal Notes" />
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Cover Image */}
                                    <ImageUpload
                                        value={data.cover_image}
                                        onChange={(file) => setData('cover_image', file)}
                                        error={errors.cover_image}
                                        existingImage={book.cover_image}
                                    />

                                    {/* Read Status */}
                                    <div>
                                        <label className="flex items-center">
                                            <Checkbox
                                                checked={data.is_read}
                                                onChange={(e) => setData('is_read', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                I have read this book
                                            </span>
                                        </label>
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <InputLabel value="Rating" />
                                        <div className="mt-2">
                                            <StarRating
                                                rating={data.rating}
                                                onChange={(rating) => setData('rating', rating)}
                                            />
                                        </div>
                                        <InputError message={errors.rating} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <Link
                                    href={route('books.index')}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Book'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
