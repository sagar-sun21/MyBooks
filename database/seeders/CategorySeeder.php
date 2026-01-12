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
            'অনুবাদ',
            'মুক্তিযুদ্ধ',
            'বিজ্ঞান',
            'ইতিহাস',
            'জীবনী',
            'স্ব-সহায়তা',
            'প্রযুক্তি',
            'দর্শনশাস্ত্র',
            'মনোবিজ্ঞান',
            'ব্যবসা',
            'রোমান্স',
            'রহস্য',
            'থ্রিলার',
            'ফ্যান্টাসি',
            'বিজ্ঞান কল্পকাহিনী',
            'ভূত',
            'কবিতা',
            'শিশুদের বই',
            'রান্না',
            'ভ্রমণ',
            'ধর্ম',
            'শিল্প ও সঙ্গীত',
            'স্বাস্থ্য ও ফিটনেস',
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create([
                'name' => $category,
            ]);
        }
    }
}
