<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
            'Science',
            'History',
            'Biography',
            'Self-Help',
            'Technology',
            'Philosophy',
            'Psychology',
            'Business',
            'Romance',
            'Mystery',
            'Thriller',
            'Fantasy',
            'Science Fiction',
            'Horror',
            'Poetry',
            'Children',
            'Young Adult',
            'Cooking',
            'Travel',
            'Religion',
            'Art',
            'Health & Fitness',
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create([
                'name' => $category,
            ]);
        }
    }
}
