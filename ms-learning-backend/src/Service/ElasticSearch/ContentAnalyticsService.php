<?php

namespace App\Service\ElasticSearch;

use App\Entity\Courses;
use App\Repository\CoursesRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Elastica\Aggregation\Filters;
use Elastica\Aggregation\Terms;
use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MatchPhrase;
use Elastica\Query\MultiMatch;
use Elastica\Query\Nested;
use Elastica\Query\Term;
use Elastica\Query\Terms as TermsQuery;
use Elastica\Search;
use FOS\ElasticaBundle\Elastica\Client;

class ContentAnalyticsService
{
    public function __construct(
        private Client $elasticaClient,
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private CoursesRepository $coursesRepository
    ) {
    }

    public function getContentAnalytics(int $instructorId): array
    {
        return [
            'reviews' => $this->getReviewAnalytics($instructorId),
            'posts' => $this->getPostAnalytics($instructorId),
        ];
    }

    private function getReviewAnalytics(int $instructorId): array
    {
        $courseIds = $this->entityManager->getRepository(Courses::class)
            ->findCourseIdsByInstructor($instructorId);

        if (empty($courseIds)) {
            return [
                'sentiment' => [
                    'positive' => 0,
                    'neutral' => 0,
                    'negative' => 0,
                ],
                'frequent_terms' => [],
                'total_reviews' => 0,
            ];
        }

        $search = new Search($this->elasticaClient);
        $search->addIndex($this->elasticaClient->getIndex('reviews'));

        $courseQuery = new Nested();
        $courseQuery->setPath('course');
        $courseQuery->setQuery(new TermsQuery('course.id', $courseIds));

        $boolQuery = new BoolQuery();
        $boolQuery->addMust($courseQuery);

        $query = new Query($boolQuery);

        $sentimentFilters = new Filters('sentiment_analysis');

        $positiveQuery = new BoolQuery();
        foreach (
            ['good', 'great', 'excellent', 'awesome',
                'perfect', 'amazing'] as $term) {
            $positiveQuery->addShould(new MatchPhrase('comment', $term));
        }
        $sentimentFilters->addFilter($positiveQuery, 'positive');

        $neutralQuery = new BoolQuery();
        foreach (['average', 'ok', 'decent', 'acceptable', 'moderate'] as $term) {
            $neutralQuery->addShould(new MatchPhrase('comment', $term));
        }
        $sentimentFilters->addFilter($neutralQuery, 'neutral');

        $negativeQuery = new BoolQuery();
        foreach (['bad', 'poor', 'terrible', 'awful',
            'horrible', 'disappointing'] as $term) {
            $negativeQuery->addShould(new MatchPhrase('comment', $term));
        }
        $sentimentFilters->addFilter($negativeQuery, 'negative');

        $frequentTerms = new Terms('frequent_terms');
        $frequentTerms->setField('comment.keyword');
        $frequentTerms->setSize(10);

        $query
            ->addAggregation($sentimentFilters)
            ->addAggregation($frequentTerms);

        $search->setQuery($query);
        $result = $search->search();

        $aggregations = $result->getAggregations();

        return [
            'sentiment' => $this->processSentiment(
                $aggregations['sentiment_analysis'] ?? []
            ),
            'frequent_terms' => $this->processTerms(
                $aggregations['frequent_terms']['buckets'] ?? []
            ),
            'total_reviews' => $result->getTotalHits(),
        ];
    }

    private function getPostAnalytics(
        int $instructorId,
    ): array {
        $instructor = $this->userRepository->find($instructorId);
        $instructorUsername = $instructor ? $instructor->getUsername() : '';

        $courseTitles = $this->coursesRepository
            ->findCourseTitlesByInstructor($instructorId);

        $search = new Search($this->elasticaClient);
        $search->addIndex($this->elasticaClient->getIndex('posts'));

        $boolQuery = new BoolQuery();

        if (! empty($instructorUsername)) {
            $fields = ['content', 'title', 'tags'];
            $nameQuery = new MultiMatch();
            $nameQuery->setQuery($instructorUsername);
            $nameQuery->setFields($fields);
            $boolQuery->addShould($nameQuery);
        }

        foreach ($courseTitles as $title) {
            $fields = ['content', 'title', 'tags'];
            $titleQuery = new MultiMatch();
            $titleQuery->setQuery($title);
            $titleQuery->setFields($fields);
            $boolQuery->addShould($titleQuery);
        }

        $boolQuery->setMinimumShouldMatch(1);
        $query = new Query($boolQuery);

        $sentimentFilters = new Filters('sentiment_analysis');

        $positiveTerms = [
            'good', 'great', 'excellent', 'awesome', 'perfect',
            'amazing', 'fantastic'];
        $neutralTerms = [
            'average', 'ok', 'decent', 'acceptable',
            'moderate', 'okay'];
        $negativeTerms = [
            'bad', 'poor', 'terrible', 'awful',
            'horrible', 'disappointing'];

        $positiveBool = new BoolQuery();
        foreach ($positiveTerms as $term) {
            $positiveBool->addShould(
                new Term([
                    'content.words' => $term,
                ])
            );
            $positiveBool->addShould(
                new Term([
                    'content.raw_words' => $term,
                ])
            );
        }
        $sentimentFilters->addFilter(
            $positiveBool,
            'positive'
        );

        $neutralBool = new BoolQuery();
        foreach ($neutralTerms as $term) {
            $neutralBool->addShould(
                new Term([
                    'content.words' => $term,
                ])
            );
            $neutralBool->addShould(
                new Term([
                    'content.raw_words' => $term,
                ])
            );
        }
        $sentimentFilters->addFilter(
            $neutralBool,
            'neutral'
        );

        $negativeBool = new BoolQuery();
        foreach ($negativeTerms as $term) {
            $negativeBool->addShould(
                new Term([
                    'content.words' => $term,
                ])
            );
            $negativeBool->addShould(
                new Term([
                    'content.raw_words' => $term,
                ])
            );
        }
        $sentimentFilters->addFilter(
            $negativeBool,
            'negative'
        );

        $frequentTerms = new Terms('frequent_terms');
        $frequentTerms->setField('content.raw_words');
        $frequentTerms->setSize(10);
        $frequentTerms->setMinimumDocumentCount(1);
        $frequentTerms->setExecutionHint('map');

        $query
            ->addAggregation($sentimentFilters)
            ->addAggregation($frequentTerms);

        $search->setQuery($query);
        $result = $search->search();

        $aggregations = $result->getAggregations();

        return [
            'sentiment' => $this->processSentiment(
                $aggregations['sentiment_analysis'] ?? []
            ),
            'frequent_terms' => $this->processTerms(
                $aggregations['frequent_terms']['buckets'] ?? []
            ),
            'total_posts' => $result->getTotalHits(),
        ];
    }

    private function processSentiment(array $sentimentData): array
    {
        $total = array_sum(
            array_column(
                $sentimentData['buckets'],
                'doc_count'
            )
        );

        if ($total === 0) {
            return [
                'positive' => 0,
                'neutral' => 0,
                'negative' => 0,
            ];
        }

        return [
            'positive' => round(
                (
                    $sentimentData['buckets']['positive']['doc_count'] ?? 0
                ) / $total * 100,
                2
            ),
            'neutral' => round(
                (
                    $sentimentData['buckets']['neutral']['doc_count'] ?? 0
                ) / $total * 100,
                2
            ),
            'negative' => round(
                (
                    $sentimentData['buckets']['negative']['doc_count'] ?? 0
                ) / $total * 100,
                2
            ),
        ];
    }

    private function processTerms(array $termsData): array
    {
        return array_map(
            function ($term) {
                return [
                    'term' => $term['key'],
                    'count' => $term['doc_count'],
                ];
            },
            $termsData
        );
    }
}
