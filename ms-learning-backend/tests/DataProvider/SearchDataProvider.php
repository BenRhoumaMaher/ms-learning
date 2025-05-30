<?php

namespace App\Tests\DataProvider;

class SearchDataProvider
{
    public static function searchWithResultsDataProvider(): array
    {
        return [
            'single_word_query_found' => [
                'php',
                [
                    [
                        'id' => 1,
                        'title' => 'Advanced PHP Course',
                        'description' => 'Learn advanced PHP techniques.',
                        'price' => 49.99,
                        'duration' => '20 hours',
                        'image' => 'php_course.png',
                    ],
                    [
                        'id' => 2,
                        'title' => 'PHP for Beginners',
                        'description' => 'A beginner friendly introduction to PHP.',
                        'price' => 19.99,
                        'duration' => '10 hours',
                        'image' => 'php_beginners.png',
                    ],
                ],
                2,
            ],
            'multi_word_query_found' => [
                'symfony framework',
                [
                    [
                        'id' => 3,
                        'title' => 'Deep Dive',
                        'description' => 'Master the framework.',
                        'price' => 99.00,
                        'duration' => '40 hours',
                        'image' => 'symfony_deep_dive.png',
                    ],
                ],
                1,
            ],
        ];
    }

    public static function searchWithNoResultsDataProvider(): array
    {
        return [
            'query_with_no_matches' => [
                'NonExistentTopicXYZ123',
            ],
        ];
    }

    public static function searchWithEmptyQueryDataProvider(): array
    {
        return [
            'empty_query_string' => [
                '',
            ],
        ];
    }
}
