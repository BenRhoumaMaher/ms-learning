<?php

/**
 * This file defines the SearchController which handles
 * Elasticsearch-based course search operations for the MS-LEARNING application.
 * It provides full-text search capabilities across course titles and descriptions.
 *
 * @category Controllers
 * @package  App\Controller\ElasticSearch
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\ElasticSearch;

use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MatchQuery;
use FOS\ElasticaBundle\Finder\FinderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles course search operations using Elasticsearch.
 * Implements fuzzy matching on course titles and exact matching on descriptions.
 *
 * @category Controllers
 * @package  App\Controller\ElasticSearch
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class SearchController extends AbstractController
{
    /**
     * @param FinderInterface $coursesFinder Elasticsearch course finder service
     */
    public function __construct(
        private readonly FinderInterface $coursesFinder
    ) {
    }

    /**
     * Search courses by query string.
     *
     * Performs a fuzzy search on course titles and exact match on descriptions.
     * Returns up to 10 matching courses with basic information.
     *
     * @param Request $request HTTP request containing 'q' query parameter
     *
     * @return JsonResponse JSON response with the following structure:
     *  - success: bool
     *  - results: array<int, array{id: int|string, title: string, description: string, price: float, duration: string, image: string|null}>
     *  - query: string
     *  - count: int
     */
    public function searchCourses(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');
        $results = [];

        if (! empty($query)) {
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
                fn($course) => [
                    'id' => $course->getId(),
                    'title' => $course->getTitle(),
                    'description' => $course->getDescription(),
                    'price' => (float) $course->getPrice(),
                    'duration' => $course->getDuration(),
                    'image' => $course->getImage(),
                ],
                $courses
            );
        }

        return $this->json(
            [
                'success' => true,
                'results' => $results,
                'query' => $query,
                'count' => count($results),
            ]
        );
    }
}
