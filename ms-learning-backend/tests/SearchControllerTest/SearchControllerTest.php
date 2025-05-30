<?php

namespace App\Tests\SearchControllerTest;

use FOS\ElasticaBundle\Finder\FinderInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SearchControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    private $coursesFinderMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient();

        $this->coursesFinderMock = $this->createMock(
            FinderInterface::class
        );

        static::getContainer()->set(
            'fos_elastica.finder.courses',
            $this->coursesFinderMock
        );
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->coursesFinderMock = null;
    }

    /**
     * @dataProvider \App\Tests\DataProvider\SearchDataProvider::searchWithResultsDataProvider
     */
    public function testSearchCoursesWithResults(string $queryTerm, array $mockedCourseData, int $expectedCount): void
    {
        $mockedCourses = [];
        foreach ($mockedCourseData as $data) {
            $course = new \stdClass();
            $course->id = $data['id'];
            $course->title = $data['title'];
            $course->description = $data['description'];
            $course->price = (string) $data['price'];
            $course->duration = $data['duration'];
            $course->image = $data['image'];

            $mockCourseObject = $this->createMock(\App\Entity\Courses::class); // Assuming your entity namespace
            $mockCourseObject->method('getId')->willReturn($data['id']);
            $mockCourseObject->method('getTitle')->willReturn($data['title']);
            $mockCourseObject->method(
                'getDescription'
            )->willReturn($data['description']);
            $mockCourseObject->method('getPrice')->willReturn((string) $data['price']); // Match entity return type
            $mockCourseObject->method('getDuration')->willReturn($data['duration']);
            $mockCourseObject->method('getImage')->willReturn($data['image']);
            $mockedCourses[] = $mockCourseObject;
        }

        $this->coursesFinderMock
            ->expects($this->once())
            ->method('find')
            ->willReturn($mockedCourses);

        $this->client->request(
            'GET',
            '/search/courses',
            [
                'q' => $queryTerm,
            ]
        );

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame(
            'Content-Type',
            'application/json'
        );

        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        $this->assertIsArray($responseContent);
        $this->assertTrue($responseContent['success']);
        $this->assertEquals($queryTerm, $responseContent['query']);
        $this->assertEquals($expectedCount, $responseContent['count']);
        $this->assertCount($expectedCount, $responseContent['results']);

        if ($expectedCount > 0) {
            $this->assertEquals(
                $mockedCourseData[0]['id'],
                $responseContent['results'][0]['id']
            );
            $this->assertEquals(
                $mockedCourseData[0]['title'],
                $responseContent['results'][0]['title']
            );
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\SearchDataProvider::searchWithNoResultsDataProvider
     */
    public function testSearchCoursesWithNoResults(string $queryTerm): void
    {
        $this->coursesFinderMock
            ->expects($this->once())
            ->method('find')
            ->willReturn([]);

        $this->client->request(
            'GET',
            '/search/courses',
            [
                'q' => $queryTerm,
            ]
        );

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame(
            'Content-Type',
            'application/json'
        );

        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        $this->assertTrue($responseContent['success']);
        $this->assertEmpty($responseContent['results']);
        $this->assertEquals($queryTerm, $responseContent['query']);
        $this->assertEquals(0, $responseContent['count']);
    }

    /**
     * @dataProvider \App\Tests\DataProvider\SearchDataProvider::searchWithEmptyQueryDataProvider
     */
    public function testSearchCoursesWithEmptyQuery(string $queryTerm): void
    {
        $this->coursesFinderMock
            ->expects($this->never())
            ->method('find');

        $this->client->request('GET', '/search/courses', [
            'q' => $queryTerm,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        $this->assertTrue($responseContent['success']);
        $this->assertEmpty($responseContent['results']);
        $this->assertEquals('', $responseContent['query']);
        $this->assertEquals(0, $responseContent['count']);
    }
}
