<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Book;
use App\Models\Author;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookAuthorTest extends TestCase
{
    use RefreshDatabase;

    public function test_book_can_be_created_with_existing_author(): void
    {
        $user = User::factory()->create();
        $author = Author::create(['name' => 'Existing Author']);

        $response = $this
            ->actingAs($user)
            ->post('/books', [
                'title' => 'Test Book',
                'author_id' => $author->id,
                'is_read' => false,
            ]);

        $response->assertSessionHasNoErrors();
        
        $this->assertDatabaseHas('books', [
            'title' => 'Test Book',
            'author_id' => $author->id,
        ]);
    }

    public function test_book_can_be_created_with_new_author_when_other_selected(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/books', [
                'title' => 'Test Book',
                'author_id' => 'other',
                'author' => 'New Author Name',
                'is_read' => false,
            ]);

        $response->assertSessionHasNoErrors();
        
        $this->assertDatabaseHas('authors', [
            'name' => 'New Author Name',
        ]);

        $newAuthor = Author::where('name', 'New Author Name')->first();
        $this->assertNotNull($newAuthor);

        $this->assertDatabaseHas('books', [
            'title' => 'Test Book',
            'author_id' => $newAuthor->id,
        ]);
    }

    public function test_book_creation_fails_when_other_selected_but_no_author_name_provided(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/books', [
                'title' => 'Test Book',
                'author_id' => 'other',
                'is_read' => false,
            ]);

        $response->assertSessionHasErrors('author');
    }

    public function test_book_creation_fails_with_invalid_author_id(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/books', [
                'title' => 'Test Book',
                'author_id' => 99999,
                'is_read' => false,
            ]);

        $response->assertSessionHasErrors('author_id');
    }

    public function test_book_can_be_updated_with_existing_author(): void
    {
        $user = User::factory()->create();
        $author1 = Author::create(['name' => 'Author 1']);
        $author2 = Author::create(['name' => 'Author 2']);
        
        $book = Book::create([
            'user_id' => $user->id,
            'title' => 'Test Book',
            'author_id' => $author1->id,
            'is_read' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/books/{$book->id}", [
                'title' => 'Updated Book',
                'author_id' => $author2->id,
                'is_read' => false,
            ]);

        $response->assertSessionHasNoErrors();
        
        $book->refresh();
        $this->assertEquals($author2->id, $book->author_id);
    }

    public function test_book_can_be_updated_with_new_author_when_other_selected(): void
    {
        $user = User::factory()->create();
        $author = Author::create(['name' => 'Original Author']);
        
        $book = Book::create([
            'user_id' => $user->id,
            'title' => 'Test Book',
            'author_id' => $author->id,
            'is_read' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/books/{$book->id}", [
                'title' => 'Updated Book',
                'author_id' => 'other',
                'author' => 'Brand New Author',
                'is_read' => false,
            ]);

        $response->assertSessionHasNoErrors();
        
        $this->assertDatabaseHas('authors', [
            'name' => 'Brand New Author',
        ]);

        $newAuthor = Author::where('name', 'Brand New Author')->first();
        $this->assertNotNull($newAuthor);

        $book->refresh();
        $this->assertEquals($newAuthor->id, $book->author_id);
    }

    public function test_book_update_fails_when_other_selected_but_no_author_name_provided(): void
    {
        $user = User::factory()->create();
        $author = Author::create(['name' => 'Original Author']);
        
        $book = Book::create([
            'user_id' => $user->id,
            'title' => 'Test Book',
            'author_id' => $author->id,
            'is_read' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/books/{$book->id}", [
                'title' => 'Updated Book',
                'author_id' => 'other',
                'is_read' => false,
            ]);

        $response->assertSessionHasErrors('author');
    }

    public function test_book_update_fails_with_invalid_author_id(): void
    {
        $user = User::factory()->create();
        $author = Author::create(['name' => 'Original Author']);
        
        $book = Book::create([
            'user_id' => $user->id,
            'title' => 'Test Book',
            'author_id' => $author->id,
            'is_read' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->put("/books/{$book->id}", [
                'title' => 'Updated Book',
                'author_id' => 99999,
                'is_read' => false,
            ]);

        $response->assertSessionHasErrors('author_id');
    }
}
