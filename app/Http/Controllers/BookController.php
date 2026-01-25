<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Category;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    /**
     * Compress and store the uploaded cover image as JPEG not exceeding given max bytes.
     * Requires PHP GD extension. Returns stored filename.
     */
    private function compressAndStoreCoverImage(\Illuminate\Http\UploadedFile $file, int $maxBytes = 2 * 1024 * 1024): string
    {
        // Create image resource from file (supports jpeg/png/gif via createfromstring)
        $raw = file_get_contents($file->getRealPath());
        $src = imagecreatefromstring($raw);
        if ($src === false) {
            // Fallback: store original if decoding failed
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/covers', $filename);
            return $filename;
        }

        // Normalize to true color
        $width = imagesx($src);
        $height = imagesy($src);

        // Resize if larger than max dimension to keep file size manageable
        $maxDim = 1600; // reasonable upper bound for covers
        $targetW = $width;
        $targetH = $height;
        if ($width > $maxDim || $height > $maxDim) {
            $ratio = min($maxDim / $width, $maxDim / $height);
            $targetW = (int) floor($width * $ratio);
            $targetH = (int) floor($height * $ratio);
        }

        $dst = imagecreatetruecolor($targetW, $targetH);
        // Fill background white (for PNG/GIF transparency) and copy resampled
        $white = imagecolorallocate($dst, 255, 255, 255);
        imagefill($dst, 0, 0, $white);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetW, $targetH, $width, $height);

        // Try decreasing quality until under maxBytes
        $quality = 85;
        $minQuality = 50;
        $binary = null;
        while ($quality >= $minQuality) {
            ob_start();
            imagejpeg($dst, null, $quality);
            $binary = ob_get_clean();
            if (strlen($binary) <= $maxBytes) {
                break;
            }
            $quality -= 5;
        }

        // If still too large, do one more pass at min quality
        if ($binary === null || strlen($binary) > $maxBytes) {
            ob_start();
            imagejpeg($dst, null, $minQuality);
            $binary = ob_get_clean();
        }

        imagedestroy($src);
        imagedestroy($dst);

        $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = time() . '_' . preg_replace('/[^A-Za-z0-9_-]/', '_', $baseName) . '.jpg';
        \Illuminate\Support\Facades\Storage::put('public/covers/' . $filename, $binary);
        return $filename;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Book::with(['categories', 'author'])
            ->where('user_id', auth()->id());

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by author
        if ($request->filled('author')) {
            $query->where('author_id', $request->author);
        }

        // Filter by multiple categories
        if ($request->filled('categories') && is_array($request->categories)) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->whereIn('categories.id', $request->categories);
            });
        }

        // Filter by read status
        if ($request->filled('is_read')) {
            $query->where('is_read', (bool) $request->is_read);
        }

        // Filter by rating
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        $books = $query->latest()->paginate(12)->withQueryString();
        
        return Inertia::render('Books/Index', [
            'books' => BookResource::collection($books),
            'categories' => Category::orderBy('name')->get(),
            'authors' => Author::orderBy('name')->get(),
            'filters' => $request->only(['search', 'categories', 'author', 'is_read', 'rating']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        $authors = Author::all();
        
        return Inertia::render('Books/Create', [
            'categories' => $categories,
            'authors' => $authors,
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

        // Handle author - either use selected author_id or create new author
        if ($request->has('author_id') && $request->author_id !== 'other' && $request->author_id !== null) {
            // Use existing author
            $data['author_id'] = $request->author_id;
            unset($data['author']);
        } elseif ($request->has('author') && $request->author) {
            // Create new author
            $author = Author::create(['name' => $request->author]);
            $data['author_id'] = $author->id;
            unset($data['author']);
        }

        // Handle image upload with compression (limit stored file to <= 2MB)
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = $this->compressAndStoreCoverImage($file, 2 * 1024 * 1024);
            $data['cover_image'] = $filename;
        }

        // Extract category_ids before creating the book
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);

        $book = Book::create($data);

        // Attach categories to the book
        if (!empty($categoryIds)) {
            $book->categories()->attach($categoryIds);
        }

        return redirect()->route('books.index')
            ->with('success', 'Book created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $this->authorize('view', $book);
        
        $book->load(['categories', 'author']);

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
        
        $book->load(['categories', 'author']);
        
        $categories = Category::all();
        $authors = Author::all();

        return Inertia::render('Books/Edit', [
            'book' => new BookResource($book),
            'categories' => $categories,
            'authors' => $authors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $data = $request->validated();
        $data['is_read'] = $request->boolean('is_read');

        // Handle author - either use selected author_id or create new author
        if ($request->has('author_id') && $request->author_id !== 'other' && $request->author_id !== null) {
            // Use existing author
            $data['author_id'] = $request->author_id;
            unset($data['author']);
        } elseif ($request->has('author') && $request->author) {
            // Create new author
            $author = Author::create(['name' => $request->author]);
            $data['author_id'] = $author->id;
            unset($data['author']);
        }

        // Handle image upload with compression (limit stored file to <= 2MB)
        if ($request->hasFile('cover_image')) {
            // Delete old image
            if ($book->cover_image) {
                Storage::delete('public/covers/' . $book->cover_image);
            }

            $file = $request->file('cover_image');
            $filename = $this->compressAndStoreCoverImage($file, 2 * 1024 * 1024);
            $data['cover_image'] = $filename;
        }

        // Extract category_ids before updating the book
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);

        $book->update($data);

        // Sync categories to the book
        $book->categories()->sync($categoryIds);

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
