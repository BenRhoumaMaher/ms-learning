<?php

namespace App\Tests\CoursesControllerTests;

use App\Entity\Category;
use App\Entity\Courses;
use App\Entity\Quiz;
use App\Entity\QuizScore;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CoursesControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    private ?EntityManagerInterface $entityManager;

    private UserPasswordHasherInterface $passwordHasher;

    private array $testUserEmails = [];

    private array $testCourseTitles = [];

    private array $testQuizIds = [];

    private array $testUserIds = [];

    private array $testCategoryIds = [];

    private array $testCourseIds = [];

    protected function setUp(): void
    {
        $this->client = static::createClient();
        parent::setUp();

        $container = $this->client->getContainer();
        if ($container === null) {
            $this->fail(
                'Failed to get container from client. 
            Kernel might not have booted correctly.'
            );
        }
        $this->entityManager = $container->get('doctrine')->getManager();
        $this->passwordHasher = $container->get(UserPasswordHasherInterface::class);

        for ($i = 0; $i < 2; $i++) {
            $user = new User();
            $email = "course-testuser{$i}@example.com";
            $user->setEmail($email);
            $user->setFirstname("CourseTest{$i}");
            $user->setLastname("User{$i}");
            $user->setUsername("Course TestUser{$i}");
            $user->setPicture('/profile/avatar.png');
            $user->setPassword($this->passwordHasher->hashPassword($user, 'TestPass123$'));
            $user->setRoles([$i === 0 ? 'ROLE_INSTRUCTOR' : 'ROLE_USER']);

            $this->entityManager->persist($user);
            $this->testUserEmails[] = $email;
        }
        $this->entityManager->flush();

        foreach ($this->testUserEmails as $email) {
            $user = $this->entityManager->getRepository(
                User::class
            )->findOneBy([
                'email' => $email,
            ]);
            if ($user) {
                $this->testUserIds[] = $user->getId();
            }
        }

        $category = new Category();
        $categoryName = 'Test Category For Courses';
        if (method_exists($category, 'setName')) {
            $category->setName($categoryName);
        }

        $this->entityManager->persist($category);
        $this->entityManager->flush();
        $this->testCategoryIds[] = $category->getId();

        $testCategory = $this->entityManager->getRepository(
            Category::class
        )->find($this->testCategoryIds[0]);
        if (! $testCategory) {
            throw new \LogicException(
                'Setup failed: Test Category not found after persisting.'
            );
        }

        for ($i = 0; $i < 2; $i++) {
            $course = new Courses();
            $title = "Test Course Title {$i}";
            $course->setTitle($title);
            $course->setDescription("Description for test course {$i}");
            $course->setCategory($testCategory);
            $course->setPrice($i % 2 === 0 ? '0.00' : '19.99');
            $course->setDuration('5 hours');
            $course->setLevel('Intermediate');
            $course->setImage("default_image_path{$i}.png");
            $course->setCreatedAt(new \DateTimeImmutable());
            $course->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($course);
            $this->testCourseTitles[] = $title;

            if ($i === 0) {
                $quiz = new Quiz();
                $quiz->setCourse($course);

                if (method_exists($quiz, 'setTitle')) {
                    $quiz->setTitle("Test Quiz for {$title}");
                }
                if (method_exists($quiz, 'setDescription')) {
                    $quiz->setDescription('A test quiz.');
                }
                if (method_exists($quiz, 'setTimeLimit')) {
                    $quiz->setTimeLimit(600);
                }
                if (method_exists($quiz, 'setPassingScore')) {
                    $quiz->setPassingScore(70);
                }
                if (method_exists($quiz, 'setCreatedAt')) {
                    $quiz->setCreatedAt(new \DateTimeImmutable());
                }
                if (method_exists($quiz, 'setUpdatedAt')) {
                    $quiz->setUpdatedAt(new \DateTimeImmutable());
                }

                $this->entityManager->persist($quiz);
            }
        }
        $this->entityManager->flush();

        $this->testCourseIds = [];
        foreach ($this->testCourseTitles as $title) {
            $courseEntity = $this->entityManager->getRepository(
                Courses::class
            )->findOneBy([
                'title' => $title,
            ]);
            if ($courseEntity) {
                $this->testCourseIds[] = $courseEntity->getId();
                if ($courseEntity->getQuiz() && $courseEntity->getTitle() === $this->testCourseTitles[0]) {
                    if (empty($this->testQuizIds)) {
                        $this->testQuizIds[] = $courseEntity->getQuiz()->getId();
                    }
                }
            }
        }
        if (empty($this->testQuizIds) && ! empty($this->testCourseIds) && isset($this->testCourseIds[0])) {
            $firstCourseWithQuiz = $this->entityManager->find(
                Courses::class,
                $this->testCourseIds[0]
            );
            if ($firstCourseWithQuiz && $firstCourseWithQuiz->getQuiz()) {
                if (! in_array(
                    $firstCourseWithQuiz->getQuiz()->getId(),
                    $this->testQuizIds
                )
                ) {
                    $this->testQuizIds[] = $firstCourseWithQuiz->getQuiz()->getId();
                }
            }
        }
    }

    protected function tearDown(): void
    {
        if ($this->entityManager === null) {
            if ($this->client && $this->client->getContainer()) {
                $this->entityManager = $this->client->getContainer()
                    ->get('doctrine')->getManager();
            } else {
                parent::tearDown();
                return;
            }
        }

        $connection = $this->entityManager->getConnection();

        try {
            $connection->executeStatement('SET FOREIGN_KEY_CHECKS=0;');

            $quizScoreRepo = $this->entityManager->getRepository(QuizScore::class);
            if (! empty($this->testUserIds) && isset($this->testUserIds[1])
                && ! empty($this->testQuizIds) && isset($this->testQuizIds[0])
            ) {
                $studentUser = $this->entityManager->find(
                    User::class,
                    $this->testUserIds[1]
                );
                $quizForScore = $this->entityManager->find(
                    Quiz::class,
                    $this->testQuizIds[0]
                );
                if ($studentUser && $quizForScore) {
                    $scores = $quizScoreRepo->findBy(
                        [
                            'user' => $studentUser,
                            'quiz' => $quizForScore,
                        ]
                    );
                    foreach ($scores as $score) {
                        $this->entityManager->remove($score);
                    }
                }
            } else {
                $allScores = $quizScoreRepo->findAll();
                foreach ($allScores as $score) {
                    $this->entityManager->remove($score);
                }
            }
            $this->entityManager->flush();

            foreach ($this->testQuizIds as $quizId) {
                if ($quizId) {
                    $quiz = $this->entityManager->find(
                        Quiz::class,
                        $quizId
                    );
                    if ($quiz) {
                        $this->entityManager->remove($quiz);
                    }
                }
            }
            $this->entityManager->flush();

            foreach ($this->testCourseIds as $courseId) {
                if ($courseId) {
                    $course = $this->entityManager->find(
                        Courses::class,
                        $courseId
                    );
                    if ($course) {
                        if (method_exists(
                            $course,
                            'getModules'
                        )
                        ) {
                            foreach ($course->getModules() as $module) {
                                if ($this->entityManager->contains($module)) {
                                    $this->entityManager->remove($module);
                                }
                            }
                        }
                        if (method_exists($course, 'getLessons')) {
                            foreach ($course->getLessons() as $lesson) {
                                if ($this->entityManager->contains($lesson)) {
                                    $this->entityManager->remove($lesson);
                                }
                            }
                        }
                        if ($this->entityManager->contains($course)) {
                            $this->entityManager->remove($course);
                        }
                    }
                }
            }
            $this->entityManager->flush();

            foreach ($this->testCategoryIds as $id) {
                $category = $this->entityManager->find(Category::class, $id);
                if ($category) {
                    $this->entityManager->remove($category);
                }
            }
            $this->entityManager->flush();

            foreach ($this->testUserIds as $id) {
                $user = $this->entityManager->find(User::class, $id);
                if ($user) {
                    $this->entityManager->remove($user);
                }
            }
            $this->entityManager->flush();

        } finally {
            $connection->executeStatement('SET FOREIGN_KEY_CHECKS=1;');
        }

        if ($this->entityManager->isOpen()) {
            $this->entityManager->close();
        }
        $this->entityManager = null;

        parent::tearDown();
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::getAllCoursesDataProvider
     */
    public function testGetAllCourses(int $expectedStatusCode, int $expectedCount): void
    {
        $this->client->request(
            'GET',
            '/courses',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
        if ($expectedStatusCode === Response::HTTP_OK) {
            $this->assertResponseHeaderSame('Content-Type', 'application/json');
            $responseContent = json_decode(
                $this->client->getResponse()->getContent(),
                true
            );
            $this->assertIsArray($responseContent);
            $this->assertCount(
                $expectedCount,
                $responseContent
            );
            if ($expectedCount > 0 && isset($responseContent[0])) {
                $item = $responseContent[0];
                $this->assertArrayHasKey('id', $item);
                $this->assertArrayHasKey('title', $item);
            }
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::getCourseByIdDataProvider
     */
    public function testGetCourseById(int $expectedStatusCode, array $expectedCourseData, int $courseIndexToFetch): void
    {
        $this->assertArrayHasKey($courseIndexToFetch, $this->testCourseIds, "Test course ID at index {$courseIndexToFetch} not found in setup. Available IDs: " . implode(', ', $this->testCourseIds));
        $courseId = $this->testCourseIds[$courseIndexToFetch];

        $this->client->request(
            'GET',
            '/course/' . $courseId,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === Response::HTTP_OK) {
            $this->assertResponseHeaderSame('Content-Type', 'application/json');
            $responseContent = json_decode(
                $this->client->getResponse()->getContent(),
                true
            );
            $this->assertIsArray($responseContent);
            $this->assertEquals(
                $expectedCourseData['title'],
                $responseContent['title']
            );
            $this->assertEquals(
                $expectedCourseData['description'],
                $responseContent['description']
            );
            if (isset($responseContent['category']['id'])
                && ! empty($this->testCategoryIds) && isset($this->testCategoryIds[0])) {
                $this->assertEquals(
                    $this->testCategoryIds[0],
                    $responseContent['category']['id']
                );
            }
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::getNonExistentCourseDataProvider
     */
    public function testGetNonExistentCourse(int $expectedStatusCode, string $expectedErrorMessagePart): void
    {
        $nonExistentId = 999999;
        $this->client->request(
            'GET',
            '/course/' . $nonExistentId,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
        if ($expectedStatusCode !== Response::HTTP_NO_CONTENT) {
            $this->assertResponseHeaderSame('Content-Type', 'application/json');
            $responseContent = json_decode(
                $this->client->getResponse()->getContent(),
                true
            );
            $this->assertIsArray(
                $responseContent,
                'Response for non-existent course was not valid JSON or null.'
            );

            if (is_array($responseContent)) {
                if (isset($responseContent['detail'])) {
                    $this->assertStringContainsString(
                        $expectedErrorMessagePart,
                        $responseContent['detail']
                    );
                } elseif (isset($responseContent['title'])) {
                    $this->assertStringContainsString(
                        $expectedErrorMessagePart,
                        $responseContent['title']
                    );
                } elseif (isset($responseContent['error'])) {
                    $this->assertArrayHasKey('error', $responseContent);
                    $this->assertStringContainsString(
                        $expectedErrorMessagePart,
                        $responseContent['error']
                    );
                } else {
                    $this->fail(
                        "404 JSON response does not contain 'detail', 'title', 
                        or 'error' key. Actual response: 
                        " . json_encode($responseContent)
                    );
                }
            }
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::createCourseDataProvider
     */
    public function testCreateCourse(int $expectedStatusCode, string $expectedMessage, array $coursePayload): void
    {
        $this->assertNotEmpty(
            $this->testUserIds,
            'Instructor user ID array is empty for testCreateCourse.'
        );
        $this->assertArrayHasKey(
            0,
            $this->testUserIds,
            'Instructor user ID (index 0) not found for testCreateCourse.'
        );
        $instructorUserId = $this->testUserIds[0];
        $coursePayload['user_id'] = $instructorUserId;

        $this->assertNotEmpty(
            $this->testCategoryIds,
            'Category ID array is empty for testCreateCourse.'
        );
        $this->assertArrayHasKey(
            0,
            $this->testCategoryIds,
            'Category ID (index 0) not found for testCreateCourse.'
        );
        $testCategoryId = $this->testCategoryIds[0];
        $coursePayload['course']['category'] = $testCategoryId;

        $dummyFilePath = tempnam(
            sys_get_temp_dir(),
            'upl_course_test_'
        );
        if ($dummyFilePath === false) {
            $this->fail(
                'Failed to create a temporary file for upload test.'
            );
        }
        file_put_contents($dummyFilePath, 'dummy file content for course creation');

        $filesForRequest = [];
        if (! empty($coursePayload['modules']) && isset($coursePayload['modules'][0]['lessons'][0])) {
            $filesForRequest = [
                'modules' => [
                    0 => [
                        'lessons' => [
                            0 => [
                                'resource' => new UploadedFile(
                                    $dummyFilePath,
                                    'lesson_resource.pdf',
                                    'application/pdf',
                                    null,
                                    true
                                ),
                            ],
                        ],
                    ],
                ],
            ];
        }

        $this->client->request(
            'POST',
            '/instructor/course/create',
            [
                'data' => json_encode($coursePayload),
            ],
            $filesForRequest,
            [
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($this->client->getResponse()->getStatusCode() === $expectedStatusCode) {
            $responseContent = json_decode(
                $this->client->getResponse()->getContent(),
                true
            );
            $this->assertIsArray($responseContent);
            $this->assertArrayHasKey('message', $responseContent);
            $this->assertEquals($expectedMessage, $responseContent['message']);
        }

        if (file_exists($dummyFilePath)) {
            @unlink($dummyFilePath);
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::createCourseInvalidDataProvider
     */
    public function testCreateCourseInvalidData(int $expectedStatusCode, string $expectedErrorMessage, ?array $payload, ?string $dataParamPresence): void
    {
        $requestParameters = [];
        if ($dataParamPresence === 'data') {
            $requestParameters['data'] = json_encode($payload);
        }

        $this->client->request(
            'POST',
            '/instructor/course/create',
            $requestParameters,
            [],
            [
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );
        $this->assertIsArray($responseContent);
        $this->assertArrayHasKey('error', $responseContent);
        $this->assertEquals($expectedErrorMessage, $responseContent['error']);
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::saveScoreDataProvider
     */
    public function testSaveScore(int $expectedStatusCode, array $expectedResponseKey, array $payload, ?int $_userIndexUnused, ?int $_quizIndexUnused): void
    {
        $this->assertGreaterThanOrEqual(
            2,
            count($this->testUserIds),
            'Need at least two users for saveScore (instructor and student).'
        );
        $this->assertArrayHasKey(
            1,
            $this->testUserIds,
            'Student user ID (index 1) not found in setup.'
        );
        $studentUser = $this->entityManager->find(
            User::class,
            $this->testUserIds[1]
        );
        $this->assertNotNull(
            $studentUser,
            "Test student user (ID: {$this->testUserIds[1]}) not found for saveScore."
        );

        $this->assertNotEmpty(
            $this->testQuizIds,
            'Test quiz ID array is empty for saveScore.'
        );
        $this->assertArrayHasKey(
            0,
            $this->testQuizIds,
            'Test quiz ID (index 0) not found in setup.'
        );
        $quiz = $this->entityManager->find(Quiz::class, $this->testQuizIds[0]);
        $this->assertNotNull(
            $quiz,
            "Test quiz (ID: {$this->testQuizIds[0]}) not found for saveScore."
        );

        $payload['userId'] = $studentUser->getId();
        $payload['quizId'] = $quiz->getId();

        $this->client->request(
            'POST',
            '/scores/save',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );
        $this->assertIsArray($responseContent);

        if ($expectedStatusCode === Response::HTTP_OK) {
            $this->assertArrayHasKey('success', $responseContent);
            $this->assertEquals(
                $expectedResponseKey['success'],
                $responseContent['success']
            );
            $this->assertArrayHasKey('scoreId', $responseContent);
            $this->assertIsInt($responseContent['scoreId']);

            $quizScore = $this->entityManager->find(
                QuizScore::class,
                $responseContent['scoreId']
            );
            $this->assertNotNull($quizScore);
            $this->assertEquals(
                $payload['score'],
                $quizScore->getScore()
            );
            if ($quizScore->getUser()) {
                $this->assertEquals(
                    $studentUser->getId(),
                    $quizScore->getUser()->getId()
                );
            } else {
                $this->fail('QuizScore user is null.');
            }
            if ($quizScore->getQuiz()) {
                $this->assertEquals(
                    $quiz->getId(),
                    $quizScore->getQuiz()->getId()
                );
            } else {
                $this->fail(
                    'QuizScore quiz is null.'
                );
            }
        } else {
            $this->assertArrayHasKey('error', $responseContent);
            if (is_string($expectedResponseKey)) {
                $this->assertEquals($expectedResponseKey, $responseContent['error']);
            } elseif (isset($expectedResponseKey['error']) && is_string($expectedResponseKey['error'])) {
                $this->assertEquals($expectedResponseKey['error'], $responseContent['error']);
            } elseif (is_string($expectedResponseKey['message'] ?? null)) {
                $this->assertEquals($expectedResponseKey['message'], $responseContent['error']);
            }
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\CourseDataProvider::saveScoreInvalidDataProvider
     */
    public function testSaveScoreInvalid(int $expectedStatusCode, string $expectedErrorMessage, array $payload, ?int $entityIdIndexForPayload): void
    {
        if ($expectedErrorMessage === 'User not found') {
            $this->assertNotEmpty(
                $this->testQuizIds,
                "Quiz IDs must be set up for 'User not found' test case."
            );
            $this->assertArrayHasKey(
                0,
                $this->testQuizIds,
                "Default quiz ID (index 0) missing for 'User not found' test."
            );
            $payload['quizId'] = $this->testQuizIds[0];
        } elseif ($expectedErrorMessage === 'Quiz not found') {
            $this->assertNotEmpty(
                $this->testUserIds,
                "User IDs must be set up for 'Quiz not found' test case."
            );
            $this->assertArrayHasKey(
                1,
                $this->testUserIds,
                "Student user ID (index 1) missing for 'Quiz not found' test."
            );
            $payload['userId'] = $this->testUserIds[1];
        } else {
            if (isset($payload['userId']) && is_int($payload['userId']) && $payload['userId'] !== 99999) {
                $this->assertArrayHasKey(1, $this->testUserIds, 'Student user ID (index 1) missing for generic invalid score test.');
                $payload['userId'] = $this->testUserIds[1];
            }
            if (isset($payload['quizId']) && is_int($payload['quizId']) && $payload['quizId'] !== 99999) {
                $this->assertArrayHasKey(0, $this->testQuizIds, 'Default quiz ID (index 0) missing for generic invalid score test.');
                $payload['quizId'] = $this->testQuizIds[0];
            }
        }

        $this->client->request(
            'POST',
            '/scores/save',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );
        $this->assertIsArray($responseContent);
        $this->assertArrayHasKey('error', $responseContent);
        $this->assertEquals(
            $expectedErrorMessage,
            $responseContent['error']
        );
    }
}
