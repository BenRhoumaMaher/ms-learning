<?php

namespace App\Service\ElasticSearch;

use Elastica\Aggregation\Avg;
use Elastica\Aggregation\Sum;
use Elastica\Aggregation\Terms;
use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\Nested;
use Elastica\Query\Term;
use Elastica\Search;
use FOS\ElasticaBundle\Elastica\Client;

class VideoEngagementAnalyticsService
{
    public function __construct(
        private Client $elasticaClient
    ) {
    }

    /**
     * @param int $instructorId
     *
     * @return array{
     *     totalViews: int|float,
     *     averageWatchTime: int|float,
     *     averageCompletion: float,
     *     totalPauses: int|float,
     *     totalReplays: int|float,
     *     topLessons: array<int, array{lessonId: int|string, totalViews: int|float, averageCompletion: float}>
     * }
     */
    public function getInstructorVideoAnalytics(int $instructorId): array
    {
        $search = new Search($this->elasticaClient);
        $index = $this->elasticaClient->getIndex('lessons');
        $search->addIndex($index);

        $instructorQuery = new Nested();
        $instructorQuery->setPath('instructor');
        $instructorQuery->setQuery(
            new Term([
                'instructor.id' => $instructorId,
            ])
        );

        $boolQuery = new BoolQuery();
        $boolQuery->addMust($instructorQuery);
        $boolQuery->addMust(
            new Term(
                [
            'type' => 'registered',
                ]
            )
        );

        $query = new Query($boolQuery);

        $avgWatchTimeAgg = new Avg('average_watch_time');
        $avgWatchTimeAgg->setField('totalWatchTime');

        $avgCompletionAgg = new Avg('average_completion');
        $avgCompletionAgg->setField('averageCompletion');

        $totalViewsAgg = new Sum('total_views');
        $totalViewsAgg->setField('totalViews');

        $totalPausesAgg = new Sum('total_pauses');
        $totalPausesAgg->setField('totalPauses');

        $totalReplaysAgg = new Sum('total_replays');
        $totalReplaysAgg->setField('totalReplays');

        $topLessonsAgg = new Terms('top_lessons');
        $topLessonsAgg->setField('id');
        $topLessonsAgg->setSize(5);
        $topLessonsAgg->addAggregation(
            (
                new Avg(
                    'avg_completion'
                ))->setField('averageCompletion')
        );
        $topLessonsAgg->addAggregation(
            (
                new Sum(
                    'total_views'
                ))->setField('totalViews')
        );

        $query
            ->addAggregation($avgWatchTimeAgg)
            ->addAggregation($avgCompletionAgg)
            ->addAggregation($totalViewsAgg)
            ->addAggregation($totalPausesAgg)
            ->addAggregation($totalReplaysAgg)
            ->addAggregation($topLessonsAgg);

        $search->setQuery($query);
        $result = $search->search();

        $aggregations = $result->getAggregations();

        $topLessons = [];
        foreach ($aggregations['top_lessons']['buckets'] ?? [] as $bucket) {
            $topLessons[] = [
                'lessonId' => $bucket['key'],
                'totalViews' => $bucket['total_views']['value'] ?? 0,
                'averageCompletion' => round(
                    $bucket['avg_completion']['value'] ?? 0,
                    2
                ),
            ];
        }

        return [
            'totalViews' => $aggregations['total_views']['value'] ?? 0,
            'averageWatchTime' => round(
                $aggregations['average_watch_time']['value'] ?? 0
            ),
            'averageCompletion' => round(
                $aggregations['average_completion']['value'] ?? 0,
                2
            ),
            'totalPauses' => $aggregations['total_pauses']['value'] ?? 0,
            'totalReplays' => $aggregations['total_replays']['value'] ?? 0,
            'topLessons' => $topLessons,
        ];
    }

    /**
     * @param int $lessonId
     * 
     * @return array{
     *     totalViews: int|float,
     *     totalWatchTime: int|float,
     *     averageCompletion: int|float,
     *     totalPauses: int|float,
     *     totalReplays: int|float
     * }
     */
    public function getLessonAnalytics(int $lessonId): array
    {
        $search = new Search($this->elasticaClient);
        $search->addIndex($this->elasticaClient->getIndex('lessons'));

        $termQuery = new Term([
            'id' => $lessonId,
        ]);
        $query = new Query($termQuery);

        $result = $search->search($query);

        if ($result->count() === 0) {
            return [];
        }

        $lesson = $result->getDocuments()[0]->getData();

        return [
            'totalViews' => $lesson['totalViews'] ?? 0,
            'totalWatchTime' => $lesson['totalWatchTime'] ?? 0,
            'averageCompletion' => $lesson['averageCompletion'] ?? 0,
            'totalPauses' => $lesson['totalPauses'] ?? 0,
            'totalReplays' => $lesson['totalReplays'] ?? 0,
        ];
    }
}
