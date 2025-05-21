<?php

/**
 * This file defines the LogStatsController which handles
 * Elasticsearch log statistics operations for the MS-LEARNING application.
 * It provides analytics on application log levels and messages.
 *
 * @category Controllers
 * @package  App\Controller\ElasticSearch
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\ElasticSearch;

use Elasticsearch\Client;
use Elasticsearch\ClientBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Provides analytics on application logs stored in Elasticsearch.
 * Extracts and aggregates log level statistics for monitoring purposes.
 *
 * @category Controllers
 * @package  App\Controller\ElasticSearch
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class LogStatsController extends AbstractController
{
    private readonly Client $elasticsearchClient;

    /**
     * Initializes the Elasticsearch client with configured hosts and retries.
     */
    public function __construct()
    {
        $this->elasticsearchClient = ClientBuilder::create()
            ->setHosts(['http://elasticsearch:9200'])
            ->setRetries(2)
            ->build();
    }

    /**
     * Get log level statistics
     *
     * Aggregates and counts log messages by their log level
     * from Elasticsearch indices matching 'ms-learning-symfony-*'.
     *
     * @return JsonResponse Array of log levels with their counts
     *                     or error message on failure
     */
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
                            'size' => 1000,
                        ],
                    ],
                ],
            ],
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
                $result[] = [
                    'level' => $level,
                    'count' => $count,
                ];
            }

            return new JsonResponse($result);
        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Extract log level from log message
     *
     * Parses the log message to extract the log level and category
     * in format "level.category".
     *
     * @param string $logMessage The complete log message
     *
     * @return string Extracted log level or original message if pattern not matched
     */
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
