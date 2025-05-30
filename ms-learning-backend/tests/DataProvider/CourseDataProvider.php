<?php

namespace App\tests\DataProvider;

use Symfony\Component\HttpFoundation\Response;

class CourseDataProvider
{
    public static function getAllCoursesDataProvider(): array
    {
        return [
            'successful_request' => [
                Response::HTTP_OK,
                2,
            ],
        ];
    }

    public static function getCourseByIdDataProvider(): array
    {
        return [
            'successful_request' => [
                Response::HTTP_OK,
                [
                    'title' => 'Test Course Title 0',
                    'description' => 'Description for test course 0',
                    'price' => '0.00',
                    'duration' => '5 hours',
                    'level' => 'Intermediate',
                    'image' => 'default_image_path0.png',
                ],
                0,
            ],
        ];
    }

    public static function getNonExistentCourseDataProvider(): array
    {
        return [
            'course_not_found' => [
                Response::HTTP_NOT_FOUND,
                'Course not found',
            ],
        ];
    }

    public static function createCourseDataProvider(): array
    {
        $validCourseData = [
            'course' => [
                'title' => 'New Test Course from DataProvider',
                'description' => 'A comprehensive new test course.',
                'duration' => '10 hours',
                'level' => 'Beginner',
                'price' => '0.00',
                'image' => 'uploads/images/default_course_creation.png',
            ],
            'modules' => [
                [
                    'title' => 'Module 1: Introduction',
                    'description' => 'Introduction to the course.',
                    'lessons' => [
                        [
                            'title' => 'Lesson 1.1: Welcome',
                            'content' => 'Welcome to the course!',
                            'type' => 'text',
                            'duration' => 600,
                        ],
                    ],
                ],
            ],
        ];

        return [
            'successful_creation_request' => [
                Response::HTTP_ACCEPTED,
                'Course creation started',
                $validCourseData,
            ],
        ];
    }

    public static function createCourseInvalidDataProvider(): array
    {
        return [
            'missing_data_parameter' => [
                Response::HTTP_BAD_REQUEST,
                'Invalid request, missing data',
                null,
                null,
            ],
            'missing_required_fields_in_data' => [
                Response::HTTP_BAD_REQUEST,
                'Missing required fields',
                [
                    'user_id' => 1,
                ],
                'data',
            ],
        ];
    }

    public static function saveScoreDataProvider(): array
    {
        $validScorePayload = [
            'score' => 8,
            'totalQuestions' => 10,
        ];
        return [
            'successful_save' => [
                Response::HTTP_OK,
                [
                    'success' => true,
                ],
                $validScorePayload,
                null,
                null,
            ],
        ];
    }

    public static function saveScoreInvalidDataProvider(): array
    {
        return [
            'missing_fields' => [
                Response::HTTP_BAD_REQUEST,
                'Missing required fields',
                [
                    'userId' => 1,
                    'quizId' => 1,
                ],
                null,
            ],
            'user_not_found' => [
                Response::HTTP_NOT_FOUND,
                'User not found',
                [
                    'userId' => 99999,
                    'score' => 5,
                    'totalQuestions' => 10,
                ],
                0,
            ],
            'quiz_not_found' => [
                Response::HTTP_NOT_FOUND,
                'Quiz not found',
                [
                    'quizId' => 99999,
                    'score' => 5,
                    'totalQuestions' => 10,
                ],
                1,
            ],
        ];
    }
}
