<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Fiction',
            'Non-Fiction',
            'Science Fiction',
            'Fantasy',
            'Mystery',
            'Thriller',
            'Romance',
            'Horror',
            'Biography',
            'Autobiography',
            'History',
            'Science',
            'Technology',
            'Self-Help',
            'Business',
            'Philosophy',
            'Psychology',
            'Poetry',
            'Drama',
            'Children',
            'Young Adult',
            'Graphic Novel',
            'Comics',
            'Cookbook',
            'Travel',
            'Art',
            'Music',
            'Sports',
            'Religion',
            'Spirituality',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category),
            ]);
        }
    }
}
