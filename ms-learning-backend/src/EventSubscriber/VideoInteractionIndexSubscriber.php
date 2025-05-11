<?php

namespace App\EventSubscriber;

use App\Entity\VideoInteraction;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use FOS\ElasticaBundle\Persister\ObjectPersisterInterface;

class VideoInteractionIndexSubscriber implements EventSubscriber
{
    private $videoInteractionPersister;

    public function __construct(ObjectPersisterInterface $videoInteractionPersister)
    {
        $this->videoInteractionPersister = $videoInteractionPersister;
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postUpdate,
            Events::postRemove,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->indexEntity($args);
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->indexEntity($args);
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof VideoInteraction) {
            return;
        }

        $this->videoInteractionPersister->deleteById($entity->getId());
    }

    private function indexEntity(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof VideoInteraction) {
            return;
        }

        $this->videoInteractionPersister->replaceOne($entity);
    }
}
