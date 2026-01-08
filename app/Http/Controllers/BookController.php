<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Book::with('category')
            ->where('user_id', auth()->id());

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Filter by read status
        if ($request->has('is_read') && $request->is_read !== null && $request->is_read !== '') {
            $query->where('is_read', $request->is_read);
        }

        // Filter by rating
        if ($request->has('rating') && $request->rating) {
            $query->where('rating', $request->rating);
        }

        $books = $query->latest()->paginate(12)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Books/Index', [
            'books' => BookResource::collection($books),
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'is_read', 'rating']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        
        return Inertia::render('Books/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['is_read'] = $request->boolean('is_read');

        // Handle image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/covers', $filename);
            $data['cover_image'] = $filename;
        }

        Book::create($data);

        return redirect()->route('books.index')
            ->with('success', 'Book created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $this->authorize('view', $book);
        
        $book->load('category');

        return Inertia::render('Books/Show', [
            'book' => new BookResource($book),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        $this->authorize('update', $book);
        
        $categories = Category::all();

        return Inertia::render('Books/Edit', [
            'book' => new BookResource($book),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $data = $request->validated();
        $data['is_read'] = $request->boolean('is_read');

        // Handle image upload
        if ($request->hasFile('cover_image')) {
            // Delete old image
            if ($book->cover_image) {
                Storage::delete('public/covers/' . $book->cover_image);
            }

            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/covers', $filename);
            $data['cover_image'] = $filename;
        }

        $book->update($data);

        return redirect()->route('books.index')
            ->with('success', 'Book updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $this->authorize('delete', $book);
        
        // Delete image
        if ($book->cover_image) {
            Storage::delete('public/covers/' . $book->cover_image);
        }

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Book deleted successfully!');
    }

    /**
     * Toggle read status of the book.
     */
    public function toggleRead(Book $book)
    {
        $this->authorize('update', $book);
        
        $book->update(['is_read' => !$book->is_read]);

        return back()->with('success', 'Book status updated!');
    }
}
