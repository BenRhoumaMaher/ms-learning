<?php

namespace App\EventSubscriber;

use App\Entity\QuizScore;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use FOS\ElasticaBundle\Persister\ObjectPersisterInterface;

class QuizScoreIndexSubscriber implements EventSubscriber
{
    private $quizScorePersister;

    public function __construct(ObjectPersisterInterface $quizScorePersister)
    {
        $this->quizScorePersister = $quizScorePersister;
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

        if (!$entity instanceof QuizScore) {
            return;
        }

        $this->quizScorePersister->deleteById($entity->getId());
    }

    private function indexEntity(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof QuizScore) {
            return;
        }

        $this->quizScorePersister->replaceOne($entity);
    }
}
