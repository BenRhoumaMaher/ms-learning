<?php

namespace App\Service\Course;

use App\Entity\Courses;
use App\Entity\Lesson;
use App\Entity\Module;
use App\Entity\StudentCourse;
use App\Repository\LessonRepository;
use App\Repository\UserRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Client;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CourseService implements CourseServiceInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private string $lessonResourceDirectory,
        private string $baseUrl,
        private LessonRepository $lessonRepository,
        private ParameterBagInterface $parameterBag
    ) {
    }

    public function translateLesson(int $lessonId, string $language): array
    {
        $lesson = $this->lessonRepository->find($lessonId);

        if (! $lesson) {
            throw new NotFoundHttpException('Lesson not found');
        }

        if ($lesson->getTranslation($language)) {
            return [
                'status' => 'success',
                'from_cache' => true,
                'segments' => $lesson->getTranslation($language),
            ];
        }

        $videoPath = $this->parameterBag->get(
            'kernel.project_dir'
        ) . '/public/' . $lesson->getVideoUrl();
        if (! file_exists($videoPath)) {
            throw new \RuntimeException('Video file not found');
        }

        $client = new \GuzzleHttp\Client();
        $response = $client->post(
            'http://whisper:5000/transcribe',
            [
                'multipart' => [
                    [
                        'name' => 'video',
                        'contents' => fopen($videoPath, 'r'),
                        'filename' => 'video.mp4',
                    ],
                    [
                        'name' => 'lang',
                        'contents' => $language,
                    ],
                ],
                'timeout' => 60,
            ]
        );

        $subtitles = json_decode($response->getBody(), true);

        if (! isset($subtitles['segments'])) {
            throw new \RuntimeException('Invalid response from translation service');
        }

        $lesson->addTranslation($language, $subtitles['segments']);
        $this->entityManager->persist($lesson);
        $this->entityManager->flush();

        return [
            'status' => 'success',
            'from_cache' => false,
            'segments' => $subtitles['segments'],
        ];
    }

    public function generateLessonNotes(int $lessonId): array
    {
        $lesson = $this->lessonRepository->find($lessonId);

        if (! $lesson) {
            throw new NotFoundHttpException('Lesson not found');
        }

        if ($lesson->getGeneratedNotes()) {
            return [
                'status' => 'success',
                'from_cache' => true,
                'summary' => $lesson->getGeneratedNotes(),
                'full_transcript' => $lesson->getFullTranscript(),
            ];
        }

        $videoPath = $this->parameterBag->get(
            'kernel.project_dir'
        ) . '/public/' . $lesson->getVideoUrl();
        if (! file_exists($videoPath)) {
            throw new \RuntimeException('Video file not found');
        }

        $client = new Client();
        $response = $client->post(
            'http://whisper:5000/generate-notes',
            [
                'multipart' => [
                    [
                        'name' => 'video',
                        'contents' => fopen($videoPath, 'r'),
                        'filename' => 'video.mp4',
                    ],
                ],
                'timeout' => 60,
            ]
        );

        $result = json_decode($response->getBody(), true);

        if (! isset($result['summary']) || ! isset($result['full_transcript'])) {
            throw new \RuntimeException('Invalid response from notes service');
        }

        $lesson->setGeneratedNotes($result['summary']);
        $lesson->setFullTranscript($result['full_transcript']);

        $this->entityManager->persist($lesson);
        $this->entityManager->flush();

        return [
            'status' => 'success',
            'from_cache' => false,
            'summary' => $result['summary'],
            'full_transcript' => $result['full_transcript'],
        ];
    }

    public function getAllCourses(): array
    {
        $courses = $this->entityManager->getRepository(Courses::class)->findAll();
        $result = [];

        foreach ($courses as $course) {
            $courseData = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'price' => $course->getPrice(),
                'duration' => $course->getDuration(),
                'level' => $course->getLevel(),
                'category' => [
                    'name' => $course->getCategory()?->getName(),
                ],
                'image' => $course->getImage(),
            ];

            $firstEnrollment = $course->getEnrollments()->first();
            if ($firstEnrollment) {
                $courseData['instructor'] = [
                    'id' => $firstEnrollment->getId(),
                    'name' => $firstEnrollment->getUsername(),
                    'expertise' => $firstEnrollment->getExpertise(),
                    'x' => $firstEnrollment->getX(),
                    'linkedin' => $firstEnrollment->getLinkedin(),
                    'instagram' => $firstEnrollment->getInstagram(),
                    'facebook' => $firstEnrollment->getFacebook(),
                    'picture' => $firstEnrollment->getPicture(),
                ];
            }

            $modules = [];
            foreach ($course->getModules() as $module) {
                $lessons = [];
                foreach ($module->getLessons() as $lesson) {
                    $lessons[] = [
                        'id' => $lesson->getId(),
                        'title' => $lesson->getTitle(),
                        'type' => $lesson->getType(),
                        'livestarttime' => $lesson->getLiveStartTime(),
                        'video_url' => $lesson->getVideoUrl(),
                        'content' => $lesson->getContent(),
                        'duration' => $lesson->getDuration(),
                        'ressources' => $lesson->getRessources(),
                    ];
                }

                $modules[] = [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                    'lessons' => $lessons,
                ];
            }

            $courseData['modules'] = $modules;
            $result[] = $courseData;
        }

        return $result;
    }

    public function getCourseById(
        int $id
    ): ?Courses {
        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($id);

        if (! $course) {
            throw new NotFoundHttpException('Course not found');
        }

        return $course;
    }

    public function getEnrolledCourseById(
        int $id
    ): ?StudentCourse {
        $course = $this->entityManager->getRepository(
            StudentCourse::class
        )->find($id);

        if (! $course) {
            throw new NotFoundHttpException('Course not found');
        }

        return $course;
    }

    public function createCourse(array $data): Courses
    {
        $course = new Courses();
        $course->setTitle($data['title']);
        $course->setDescription($data['description']);
        $course->setDuration($data['duration']);
        $course->setLevel($data['level']);
        $course->setCreatedAt(new DateTimeImmutable());

        if (isset($data['price'])) {
            $course->setPrice($data['price']);
        }

        if (isset($data['image'])) {
            $course->setImage($data['image']);
        }

        if (isset($data['category'])) {
            $course->setCategory($data['category']);
        }

        if (isset($data['promotion'])) {
            $course->setPromotion($data['promotion']);
        }

        if (isset($data['discount'])) {
            $course->setDiscount($data['discount']);
        }

        $this->entityManager->persist($course);
        $this->entityManager->flush();

        return $course;
    }

    public function updateCourse(
        Courses $course,
        array $data
    ): Courses {
        $course->setTitle($data['title']);
        $course->setDescription($data['description']);
        $course->setDuration($data['duration']);
        $course->setLevel($data['level']);
        $course->setUpdatedAt(new DateTime());

        if (isset($data['price'])) {
            $course->setPrice($data['price']);
        }

        if (isset($data['image'])) {
            $course->setImage($data['image']);
        }

        if (isset($data['category'])) {
            $course->setCategory($data['category']);
        }

        if (isset($data['promotion'])) {
            $course->setPromotion($data['promotion']);
        }

        if (isset($data['discount'])) {
            $course->setDiscount($data['discount']);
        }

        $this->entityManager->flush();

        return $course;
    }

    public function deleteCourse(Courses $course): void
    {
        $this->entityManager->remove($course);
        $this->entityManager->flush();
    }

    public function createFullCourse(
        Request $request
    ): array {
        $jsonData = $request->request->get('data');
        if (! $jsonData) {
            return [
                'error' => 'Invalid request, missing data',
                'status' => 400,
            ];
        }

        $data = json_decode($jsonData, true);
        if (! $data || ! isset($data['user_id'], $data['course'], $data['modules'])) {
            return [
                'error' => 'Missing required fields',
                'status' => 400,
            ];
        }

        $user = $this->userRepository->findOneBy([
            'id' => $data['user_id'],
        ]);
        if (! $user) {
            return [
                'error' => 'User not found',
                'status' => 404,
            ];
        }

        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($data['course']);
        if (! $course) {
            return [
                'error' => 'Course not found',
                'status' => 404,
            ];
        }

        foreach ($data['modules'] as $moduleIndex => $moduleData) {
            if (! isset($moduleData['title'], $moduleData['position'])) {
                continue;
            }

            $module = new Module();
            $module->setTitle($moduleData['title']);
            $module->setPosition($moduleData['position']);
            $module->setCourse($course);
            $module->setUser($user);
            $module->setCreatedAt(new DateTimeImmutable());
            $this->entityManager->persist($module);

            foreach ($moduleData['lessons'] as $lessonIndex => $lessonData) {
                if (! isset($lessonData['title'], $lessonData['content'])) {
                    continue;
                }

                $lesson = new Lesson();
                $lesson->setTitle($lessonData['title']);
                $lesson->setContent($lessonData['content']);
                $lesson->setDuration($lessonData['duration']);
                $lesson->setPosition($lessonData['position']);
                $lesson->setType($lessonData['type']);
                $lesson->setModule($module);
                $lesson->setUser($user);
                $lesson->setCreatedAt(new DateTimeImmutable());

                if ($lessonData['type'] === 'registered' && isset($lessonData['video_url'])) {
                    $lesson->setVideoUrl($lessonData['video_url']);
                }
                if ($lessonData['type'] === 'live') {
                    if (isset($lessonData['livestarttime'])) {
                        $lesson->setLiveStartTime(
                            new DateTime($lessonData['livestarttime'])
                        );
                    }
                    if (isset($lessonData['liveendtime'])) {
                        $lesson->setLiveEndTime(
                            new DateTime($lessonData['liveendtime'])
                        );
                    }
                    if (isset($lessonData['liveMeetingLink'])) {
                        $lesson->setLiveMeetingLink($lessonData['liveMeetingLink']);
                    }
                }

                $files = $request->files->all();
                if (isset($files['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'])) {
                    $file = $files['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'];
                    $fileUrl = $this->uploadFile($file);
                    $lesson->setRessources($fileUrl);
                }

                $this->entityManager->persist($lesson);
            }
        }

        $this->entityManager->flush();

        return [
            'message' => 'Course created successfully',
            'status' => 201,
        ];
    }

    public function uploadFile(?UploadedFile $file): ?string
    {
        if (! $file) {
            return null;
        }

        $filename = uniqid() . '.' . $file->guessExtension();
        $file->move($this->lessonResourceDirectory, $filename);
        return $this->baseUrl . '/images/courseressources/' . $filename;
    }
}
