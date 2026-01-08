import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from '@/Components/BookForm';

export default function Create({ auth, categories }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Book</h2>
                    <Link
                        href={route('books.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Books
                    </Link>
                </div>
            }
        >
            <Head title="Add New Book" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <BookForm categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
