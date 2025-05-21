<?php

namespace App\Service\ElasticSearch;

use Elastica\Aggregation\Avg;
use Elastica\Aggregation\Max;
use Elastica\Aggregation\Min;
use Elastica\Aggregation\ValueCount;
use Elastica\Query;
use Elastica\Query\Nested;
use Elastica\Query\Term;
use Elastica\Search;
use FOS\ElasticaBundle\Elastica\Client;

class QuizAnalyticsService
{
    public function __construct(
        private Client $elasticaClient
    ) {
    }

    /**
     * @return array{
     *     totalAttempts: int,
     *     averageScore: float,
     *     highestScore: float,
     *     lowestScore: float
     * }
     */
    public function getInstructorQuizAnalytics(int $instructorId): array
    {

        $search = new Search($this->elasticaClient);
        $index = $this->elasticaClient->getIndex('quiz_scores');
        $this->elasticaClient->getIndex('quiz_scores')->refresh();
        $search->addIndex($index);

        $instructorTerm = new Term([
            'quiz.instructor.id' => $instructorId,
        ]);
        $instructorNested = new Nested();
        $instructorNested->setPath('quiz.instructor');
        $instructorNested->setQuery($instructorTerm);

        $quizNested = new Nested();
        $quizNested->setPath('quiz');
        $quizNested->setQuery($instructorNested);

        $query = new Query($quizNested);

        $avgScoreAgg = new Avg('average_score');
        $avgScoreAgg->setField('percentage');

        $maxScoreAgg = new Max('highest_score');
        $maxScoreAgg->setField('percentage');

        $minScoreAgg = new Min('lowest_score');
        $minScoreAgg->setField('percentage');

        $totalAttemptsAgg = new ValueCount('total_attempts', 'id');

        $query
            ->addAggregation($avgScoreAgg)
            ->addAggregation($maxScoreAgg)
            ->addAggregation($minScoreAgg)
            ->addAggregation($totalAttemptsAgg);

        $search->setQuery($query);
        $result = $search->search();

        $aggregations = $result->getAggregations();

        return [
            'totalAttempts' => $aggregations['total_attempts']['value'] ?? 0,
            'averageScore' => round(
                $aggregations['average_score']['value'] ?? 0,
                2
            ),
            'highestScore' => round(
                $aggregations['highest_score']['value'] ?? 0,
                2
            ),
            'lowestScore' => round(
                $aggregations['lowest_score']['value'] ?? 0,
                2
            ),
        ];
    }
}
