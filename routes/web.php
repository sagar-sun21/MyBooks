<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $totalBooks = \App\Models\Book::where('user_id', auth()->id())->count();
    $booksRead = \App\Models\Book::where('user_id', auth()->id())->where('is_read', true)->count();
    $booksUnread = \App\Models\Book::where('user_id', auth()->id())->where('is_read', false)->count();
    $averageRating = \App\Models\Book::where('user_id', auth()->id())->whereNotNull('rating')->avg('rating');
    $booksByCategory = \App\Models\Book::where('user_id', auth()->id())
        ->with('category')
        ->get()
        ->groupBy('category.name')
        ->map(function ($books) {
            return count($books);
        });

    return Inertia::render('Dashboard', [
        'stats' => [
            'totalBooks' => $totalBooks,
            'booksRead' => $booksRead,
            'booksUnread' => $booksUnread,
            'averageRating' => round($averageRating, 1),
            'booksByCategory' => $booksByCategory,
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Book routes
    Route::resource('books', BookController::class);
    Route::patch('/books/{book}/toggle-read', [BookController::class, 'toggleRead'])->name('books.toggle-read');
    
    // Category routes
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
});

require __DIR__.'/auth.php';
