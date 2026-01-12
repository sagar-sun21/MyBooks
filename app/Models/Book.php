<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'author_id',
        'title',
        'isbn',
        'description',
        'cover_image',
        'is_read',
        'rating',
        'notes',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'rating' => 'integer',
    ];

    /**
     * Get the user that owns the book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the categories for the book.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Get the author of the book.
     */
    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
