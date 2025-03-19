<?php

namespace App\DataFixtures;

use App\Entity\Courses;
use App\Entity\Category;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $categoriesData = [
            'Programming' => [
                ['title' => 'Python for Everybody', 'description' => 'Intro to Python programming.', 'duration' => '4 weeks', 'level' => 'Beginner', 'image' => 'python.jpg', 'price' => 0],
                ['title' => 'Java Programming', 'description' => 'Learn Java programming and software engineering.', 'duration' => '6 weeks', 'level' => 'Intermediate', 'image' => 'java.jpg', 'price' => 39.99],
                ['title' => 'Full-Stack Web Development with React', 'description' => 'Build web apps using React.', 'duration' => '8 weeks', 'level' => 'Advanced', 'image' => 'fullstack.jpg', 'price' => 49.99],
                ['title' => 'Introduction to Programming with MATLAB', 'description' => 'Learn MATLAB programming.', 'duration' => '5 weeks', 'level' => 'Beginner', 'image' => 'matlab.jpg', 'price' => 0],
                ['title' => 'C++ For C Programmers', 'description' => 'Transition from C to C++.', 'duration' => '7 weeks', 'level' => 'Intermediate', 'image' => 'c++.jpg', 'price' => 29.99],
            ],
            'Design' => [
                ['title' => 'Graphic Design Specialization', 'description' => 'Learn graphic design basics.', 'duration' => '6 weeks', 'level' => 'Intermediate', 'image' => 'graphicdesign.jpg', 'price' => 29.99],
                ['title' => 'UX Design Essentials', 'description' => 'Understand user experience design.', 'duration' => '5 weeks', 'level' => 'Beginner', 'image' => 'ux.jpg', 'price' => 0],
                ['title' => 'Introduction to Typography', 'description' => 'Study typography principles.', 'duration' => '4 weeks', 'level' => 'Beginner', 'image' => 'typography.jpg', 'price' => 0],
                ['title' => 'Fundamentals of Graphic Design', 'description' => 'Learn design composition & color.', 'duration' => '6 weeks', 'level' => 'Intermediate', 'image' => 'fundgraphic.jpg', 'price' => 19.99],
                ['title' => 'Design Thinking for Innovation', 'description' => 'Explore design thinking.', 'duration' => '7 weeks', 'level' => 'Advanced', 'image' => 'designthinking.jpg', 'price' => 39.99],
            ],
            'Business' => [
                ['title' => 'Business Foundations Specialization', 'description' => 'Essential business topics.', 'duration' => '8 weeks', 'level' => 'Beginner', 'image' => 'businessFoundations.jpg', 'price' => 0],
                ['title' => 'Financial Markets', 'description' => 'Overview of financial markets.', 'duration' => '5 weeks', 'level' => 'Intermediate', 'image' => 'financialMarkets.jpg', 'price' => 29.99],
                ['title' => 'Entrepreneurship', 'description' => 'Launching an innovative business.', 'duration' => '6 weeks', 'level' => 'Advanced', 'image' => 'entrepreneurship.jpg', 'price' => 49.99],
                ['title' => 'Digital Marketing Specialization', 'description' => 'Marketing strategies & tools.', 'duration' => '7 weeks', 'level' => 'Intermediate', 'image' => 'digitalMarketing.jpg', 'price' => 0],
                ['title' => 'Strategic Leadership', 'description' => 'Develop leadership skills.', 'duration' => '5 weeks', 'level' => 'Advanced', 'image' => 'strategicLeadership.jpg', 'price' => 39.99],
            ],
            'Data Science' => [
                ['title' => 'IBM Data Science Certificate', 'description' => 'Learn data science methodologies.', 'duration' => '10 weeks', 'level' => 'Advanced', 'image' => 'ibm.jpg', 'price' => 49.99],
                ['title' => 'Applied Data Science with Python', 'description' => 'Data analysis with Python.', 'duration' => '8 weeks', 'level' => 'Intermediate', 'image' => 'appliedDataScience.jpg', 'price' => 39.99],
                ['title' => 'Machine Learning', 'description' => 'Intro to ML with Andrew Ng.', 'duration' => '9 weeks', 'level' => 'Advanced', 'image' => 'machineLearning.jpg', 'price' => 0],
                ['title' => 'Data Science MicroMasters', 'description' => 'Essential data science skills.', 'duration' => '12 weeks', 'level' => 'Advanced', 'image' => 'dataScienceMicroMasters.jpg', 'price' => 59.99],
                ['title' => 'Big Data Specialization', 'description' => 'Learn big data processing.', 'duration' => '8 weeks', 'level' => 'Intermediate', 'image' => 'bigData.jpg', 'price' => 0],
            ],
            'Cybersecurity' => [
                ['title' => 'Cyber Security Specialization', 'description' => 'Foundational knowledge in cybersecurity.', 'duration' => '6 weeks', 'level' => 'Beginner', 'image' => 'cyberSecurity.jpg', 'price' => 0],
                ['title' => 'IBM Cybersecurity Analyst', 'description' => 'Prepares for security analyst roles.', 'duration' => '8 weeks', 'level' => 'Intermediate', 'image' => 'iBMCybersecurity.jpg', 'price' => 29.99],
                ['title' => 'Cybersecurity for Business', 'description' => 'Protect business data.', 'duration' => '7 weeks', 'level' => 'Advanced', 'image' => 'cybersecurityforBusiness.jpg', 'price' => 39.99],
                ['title' => 'Network Security', 'description' => 'Network infrastructure security.', 'duration' => '5 weeks', 'level' => 'Intermediate', 'image' => 'networkSecurity.jpg', 'price' => 0],
                ['title' => 'Breach Response Case Studies', 'description' => 'Practical cybersecurity breach response.', 'duration' => '9 weeks', 'level' => 'Advanced', 'image' => 'breachResponse.jpg', 'price' => 49.99],
            ],
        ];
        foreach ($categoriesData as $categoryName => $courses) {
            $category = new Category();
            $category->setName($categoryName);
            $manager->persist($category);

            foreach ($courses as $courseData) {
                $course = new Courses();
                $course->setTitle($courseData['title'])
                    ->setDescription($courseData['description'])
                    ->setDuration($courseData['duration'])
                    ->setLevel($courseData['level'])
                    ->setImage('images/courses/' . $courseData['image'])
                    ->setPrice($courseData['price'])
                    ->setCategory($category)
                    ->setCreatedAt(new \DateTimeImmutable());

                $manager->persist($course);
            }
        }

        $manager->flush();
    }
}
