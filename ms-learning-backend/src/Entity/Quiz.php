<?php

namespace App\Entity;

use App\Repository\QuizRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: QuizRepository::class)]
class Quiz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['quizscore:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\OneToOne(inversedBy: 'quiz', cascade: ['persist', 'remove'])]
    private ?Courses $course = null;

    #[ORM\Column]
    private ?int $timeLimit = null;

    #[ORM\Column]
    private ?int $passingScore = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $instructor = null;

    /**
     * @var Collection<int, Question>
     */
    #[ORM\OneToMany(targetEntity: Question::class, mappedBy: 'quiz')]
    private Collection $questions;

    /**
     * @var Collection<int, QuizScore>
     */
    #[ORM\OneToMany(targetEntity: QuizScore::class, mappedBy: 'quiz')]
    private Collection $quizScores;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
        $this->quizScores = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getInstructor(): ?User
    {
        return $this->instructor;
    }

    public function setInstructor(?User $instructor): self
    {
        $this->instructor = $instructor;
        return $this;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCourse(): ?Courses
    {
        return $this->course;
    }

    public function setCourse(?Courses $course): static
    {
        $this->course = $course;

        return $this;
    }

    public function getTimeLimit(): ?int
    {
        return $this->timeLimit;
    }

    public function setTimeLimit(int $timeLimit): static
    {
        $this->timeLimit = $timeLimit;

        return $this;
    }

    public function getPassingScore(): ?int
    {
        return $this->passingScore;
    }

    public function setPassingScore(int $passingScore): static
    {
        $this->passingScore = $passingScore;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, Question>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): static
    {
        if (! $this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setQuiz($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): static
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getQuiz() === $this) {
                $question->setQuiz(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, QuizScore>
     */
    public function getQuizScores(): Collection
    {
        return $this->quizScores;
    }

    public function addQuizScore(QuizScore $quizScore): static
    {
        if (! $this->quizScores->contains($quizScore)) {
            $this->quizScores->add($quizScore);
            $quizScore->setQuiz($this);
        }

        return $this;
    }

    public function removeQuizScore(QuizScore $quizScore): static
    {
        if ($this->quizScores->removeElement($quizScore)) {
            // set the owning side to null (unless already changed)
            if ($quizScore->getQuiz() === $this) {
                $quizScore->setQuiz(null);
            }
        }

        return $this;
    }
}
