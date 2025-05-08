<?php

namespace App\Controller\ElasticSearch;

use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MatchQuery;
use Symfony\Component\HttpFoundation\Request;
use FOS\ElasticaBundle\Finder\FinderInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SearchController extends AbstractController
{
    public function __construct(private FinderInterface $coursesFinder)
    {
    }
    public function searchCourses(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');
        $results = [];

        if (!empty($query)) {
            $boolQuery = new BoolQuery();

            $titleQuery = new MatchQuery();
            $titleQuery->setFieldQuery('title', $query);
            $titleQuery->setFieldFuzziness('title', 'AUTO');

            $descQuery = new MatchQuery();
            $descQuery->setFieldQuery('description', $query);

            $boolQuery->addShould($titleQuery);
            $boolQuery->addShould($descQuery);

            $boolQuery->setMinimumShouldMatch(1);

            $elasticaQuery = new Query($boolQuery);
            $elasticaQuery->setSize(10);

            $courses = $this->coursesFinder->find($elasticaQuery);

            $results = array_map(
                function ($course) {
                    return [
                        'id' => $course->getId(),
                        'title' => $course->getTitle(),
                        'description' => $course->getDescription(),
                        'price' => (float)$course->getPrice(),
                        'duration' => $course->getDuration(),
                        'image' => $course->getImage(),
                    ];
                },
                $courses
            );
        }

        return $this->json(
            [
            'success' => true,
            'results' => $results,
            'query' => $query,
            'count' => count($results)
            ]
        );
    }
}
