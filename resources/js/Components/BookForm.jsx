import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import StarRating from '@/Components/StarRating';
import ImageUpload from '@/Components/ImageUpload';
import Checkbox from '@/Components/Checkbox';

export default function BookForm({ book = null, categories = [], onSubmit, processing = false }) {
    const { data, setData, post, put, errors } = useForm({
        title: book?.title || '',
        author: book?.author || '',
        isbn: book?.isbn || '',
        description: book?.description || '',
        category_id: book?.category?.id || '',
        cover_image: null,
        is_read: book?.is_read || false,
        rating: book?.rating || 0,
        notes: book?.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });

        // For update, add _method field for Laravel
        if (book) {
            formData.append('_method', 'PUT');
            post(route('books.update', book.id), {
                data: formData,
                forceFormData: true,
                onSuccess: () => onSubmit?.(),
            });
        } else {
            post(route('books.store'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => onSubmit?.(),
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div>
                <InputLabel htmlFor="title" value="Title *" />
                <TextInput
                    id="title"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    autoFocus
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            {/* Author */}
            <div>
                <InputLabel htmlFor="author" value="Author *" />
                <TextInput
                    id="author"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.author}
                    onChange={(e) => setData('author', e.target.value)}
                    required
                />
                <InputError message={errors.author} className="mt-2" />
            </div>

            {/* ISBN */}
            <div>
                <InputLabel htmlFor="isbn" value="ISBN" />
                <TextInput
                    id="isbn"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.isbn}
                    onChange={(e) => setData('isbn', e.target.value)}
                />
                <InputError message={errors.isbn} className="mt-2" />
            </div>

            {/* Category */}
            <div>
                <InputLabel htmlFor="category_id" value="Category" />
                <select
                    id="category_id"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.category_id} className="mt-2" />
            </div>

            {/* Description */}
            <div>
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows="4"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            {/* Cover Image */}
            <ImageUpload
                label="Cover Image"
                onChange={(file) => setData('cover_image', file)}
                error={errors.cover_image}
                currentImage={book?.cover_image}
            />

            {/* Read Status */}
            <div className="flex items-center">
                <Checkbox
                    id="is_read"
                    checked={data.is_read}
                    onChange={(e) => setData('is_read', e.target.checked)}
                />
                <InputLabel htmlFor="is_read" value="I have read this book" className="ml-2" />
            </div>

            {/* Rating */}
            <div>
                <InputLabel value="Rating" />
                <div className="mt-2">
                    <StarRating
                        rating={data.rating}
                        setRating={(rating) => setData('rating', rating)}
                    />
                </div>
                <InputError message={errors.rating} className="mt-2" />
            </div>

            {/* Personal Notes */}
            <div>
                <InputLabel htmlFor="notes" value="Personal Notes" />
                <textarea
                    id="notes"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows="4"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Your thoughts about this book..."
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
                <PrimaryButton disabled={processing}>
                    {processing ? 'Saving...' : (book ? 'Update Book' : 'Create Book')}
                </PrimaryButton>
            </div>
        </form>
    );
}
