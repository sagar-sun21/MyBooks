<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Models\Book;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $userId = auth()->id();
    
    $stats = [
        'total_books' => Book::where('user_id', $userId)->count(),
        'read_books' => Book::where('user_id', $userId)->where('is_read', true)->count(),
        'unread_books' => Book::where('user_id', $userId)->where('is_read', false)->count(),
        'average_rating' => Book::where('user_id', $userId)->whereNotNull('rating')->avg('rating'),
        'books_by_category' => Book::where('user_id', $userId)
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, count(*) as count')
            ->groupBy('categories.name')
            ->get(),
    ];
    
    return Inertia::render('Dashboard', [
        'stats' => $stats,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Book routes
    Route::resource('books', BookController::class);
    Route::post('/books/{book}/toggle-read', [BookController::class, 'toggleRead'])->name('books.toggle-read');
    
    // Category routes
    Route::get('/api/categories', [CategoryController::class, 'index'])->name('categories.index');
});

require __DIR__.'/auth.php';
