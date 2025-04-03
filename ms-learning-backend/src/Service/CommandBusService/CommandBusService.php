<?php

namespace App\Service\CommandBusService;

use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Exception\HandlerFailedException;

class CommandBusService
{
    public function __construct(
        private MessageBusInterface $commandBus
    ) {
    }

    public function handle(object $command): mixed
    {
        try {
            $envelope = $this->commandBus->dispatch($command);
            $handledStamp = $envelope->last(HandledStamp::class);

            return $handledStamp ? $handledStamp->getResult() : null;
        } catch (HandlerFailedException $e) {
            throw $e->getPrevious() ?? $e;
        }
    }
}
