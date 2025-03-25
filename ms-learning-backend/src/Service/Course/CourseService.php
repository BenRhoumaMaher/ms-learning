<?php

namespace App\Service\Course;

use DateTime;
use App\Entity\Lesson;
use App\Entity\Module;
use DateTimeImmutable;
use App\Entity\Courses;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CourseService implements CourseServiceInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private string $lessonResourceDirectory,
        private string $baseUrl
    ) {
    }

    public function getAllCourses(): array
    {
        return $this->entityManager->getRepository(
            Courses::class
        )->findAll();
    }

    public function getCourseById(
        int $id
    ): ?Courses {
        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($id);

        if (!$course) {
            throw new NotFoundHttpException("Course not found");
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

    public function updateCourse(Courses $course, array $data): Courses
    {
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
        if (!$jsonData) {
            return ['error' => 'Invalid request, missing data', 'status' => 400];
        }

        $data = json_decode($jsonData, true);
        if (!$data || !isset($data['user_id'], $data['course'], $data['modules'])) {
            return ['error' => 'Missing required fields', 'status' => 400];
        }

        $user = $this->userRepository->findOneBy(['id' => $data['user_id']]);
        if (!$user) {
            return ['error' => 'User not found', 'status' => 404];
        }

        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($data['course']);
        if (!$course) {
            return ['error' => 'Course not found', 'status' => 404];
        }

        foreach ($data['modules'] as $moduleIndex => $moduleData) {
            if (!isset($moduleData['title'], $moduleData['position'])) {
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
                if (!isset($lessonData['title'], $lessonData['content'])) {
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

        return ['message' => 'Course created successfully', 'status' => 201];
    }

    private function uploadFile(?UploadedFile $file): ?string
    {
        if (!$file) {
            return null;
        }

        $filename = uniqid() . '.' . $file->guessExtension();
        $file->move($this->lessonResourceDirectory, $filename);
        return $this->baseUrl . '/images/courseressources/' . $filename;
    }


}
