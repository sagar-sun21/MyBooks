<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            [
                'name' => 'J.K. Rowling',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'George Orwell',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'Jane Austen',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'Stephen King',
                'country' => 'United States',
            ],
            [
                'name' => 'Agatha Christie',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'J.R.R. Tolkien',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'Ernest Hemingway',
                'country' => 'United States',
            ],
            [
                'name' => 'Mark Twain',
                'country' => 'United States',
            ],
            [
                'name' => 'Charles Dickens',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'Leo Tolstoy',
                'country' => 'Russia',
            ],
            [
                'name' => 'Virginia Woolf',
                'country' => 'United Kingdom',
            ],
            [
                'name' => 'Harper Lee',
                'country' => 'United States',
            ],
            [
                'name' => 'F. Scott Fitzgerald',
                'country' => 'United States',
            ],
            [
                'name' => 'Gabriel García Márquez',
                'country' => 'Colombia',
            ],
            [
                'name' => 'Fyodor Dostoevsky',
                'country' => 'Russia',
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
