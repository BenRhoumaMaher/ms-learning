<?php

namespace App\Controller\ElasticSearch;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Elasticsearch\ClientBuilder;

class LogStatsController extends AbstractController
{
    private $elasticsearchClient;

    public function __construct()
    {
        $this->elasticsearchClient = ClientBuilder::create()
            ->setHosts(['http://elasticsearch:9200'])
            ->setRetries(2)
            ->build();
    }

    public function getLogLevelStats(): JsonResponse
    {
        $params = [
            'index' => 'ms-learning-symfony-*',
            'body' => [
                'size' => 0,
                'aggs' => [
                    'log_messages' => [
                        'terms' => [
                            'field' => 'event.original.keyword',
                            'size' => 1000
                        ]
                    ]
                ]
            ]
        ];

        try {
            $response = $this->elasticsearchClient->search($params);
            $buckets = $response['aggregations']['log_messages']['buckets'];

            $levelCounts = [];
            foreach (
                $buckets as $bucket) {
                $level = $this->extractLogLevel($bucket['key']);
                $levelCounts[$level] = (
                    $levelCounts[$level] ?? 0
                ) + $bucket['doc_count'];
            }

            $result = [];
            foreach ($levelCounts as $level => $count) {
                $result[] = ['level' => $level, 'count' => $count];
            }

            return new JsonResponse($result);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    private function extractLogLevel(
        string $logMessage
    ): string {
        if (preg_match(
            '/\] (\w+)\.(\w+):/',
            $logMessage,
            $matches
        )
        ) {
            return $matches[1] . '.' . $matches[2];
        }
        return $logMessage;
    }
}
