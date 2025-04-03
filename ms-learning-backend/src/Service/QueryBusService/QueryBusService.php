<?php

namespace App\Service\QueryBusService;

use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Messenger\Exception\HandlerFailedException;

class QueryBusService
{
    public function __construct(
        private MessageBusInterface $queryBus
    ) {
    }

    public function handle(object $query): mixed
    {
        try {
            $envelope = $this->queryBus->dispatch($query);
            $handledStamp = $envelope->last(HandledStamp::class);

            if (!$handledStamp) {
                throw new \Exception('No response from handler');
            }

            return $handledStamp->getResult();
        } catch (HandlerFailedException $e) {
            throw $e->getPrevious() ?? $e;
        }
    }
}
