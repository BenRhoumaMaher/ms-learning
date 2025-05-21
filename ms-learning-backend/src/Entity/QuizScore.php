<?php

namespace App\Entity;

use App\Repository\QuizScoreRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: QuizScoreRepository::class)]
class QuizScore
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['quizscore:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'quizScores')]
    #[Groups(['quizscore:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'quizScores')]
    #[Groups(['quizscore:read'])]
    private ?Quiz $quiz = null;

    #[ORM\Column]
    #[Groups(['quizscore:read'])]
    private ?int $score = null;

    #[ORM\Column]
    private ?int $totalQuestions = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $percentage = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $completedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getQuiz(): ?Quiz
    {
        return $this->quiz;
    }

    public function setQuiz(?Quiz $quiz): static
    {
        $this->quiz = $quiz;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;
        $this->updatePercentage();
        return $this;
    }

    public function getTotalQuestions(): ?int
    {
        return $this->totalQuestions;
    }

    public function setTotalQuestions(int $totalQuestions): static
    {
        $this->totalQuestions = $totalQuestions;
        $this->updatePercentage();
        return $this;
    }

    public function getCompletedAt(): ?\DateTimeImmutable
    {
        return $this->completedAt;
    }

    public function setCompletedAt(\DateTimeImmutable $completedAt): static
    {
        $this->completedAt = $completedAt;

        return $this;
    }

    public function getPercentage(): ?float
    {
        return $this->percentage;
    }

    public function setPercentage(?float $percentage): static
    {
        $this->percentage = $percentage;
        return $this;
    }

    private function updatePercentage(): void
    {
        if ($this->totalQuestions > 0) {
            $this->percentage = round(
                ($this->score / $this->totalQuestions) * 100,
                2
            );
        }
    }
}
