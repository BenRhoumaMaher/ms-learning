<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\LessonRepository;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LessonRepository::class)]
class Lesson
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['lesson:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['lesson:read'])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(['lesson:read'])]
    private ?string $content = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $videoUrl = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['lesson:read'])]
    private ?\DateTimeInterface $liveStartTime = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['lesson:read'])]
    private ?\DateTimeInterface $liveEndTime = null;

    #[ORM\Column]
    #[Groups(['lesson:read'])]
    private ?int $duration = null;

    #[ORM\ManyToOne(inversedBy: 'lessons')]
    #[Groups(['lesson:read'])]
    private ?Courses $course = null;

    #[ORM\Column]
    #[Groups(['lesson:read'])]
    private ?int $position = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['lesson:read'])]
    private ?string $ressources = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['lesson:read'])]
    private ?string $liveMeetingLink = null;

    #[ORM\ManyToOne(inversedBy: 'lessons')]
    private ?Module $module = null;

    #[ORM\ManyToOne(inversedBy: 'lessons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(nullable: true)]
    private ?array $translations = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $generatedNotes = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $fullTranscript = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getVideoUrl(): ?string
    {
        return $this->videoUrl;
    }

    public function setVideoUrl(?string $videoUrl): static
    {
        $this->videoUrl = $videoUrl;

        return $this;
    }

    public function getLiveStartTime(): ?\DateTimeInterface
    {
        return $this->liveStartTime;
    }

    public function setLiveStartTime(?\DateTimeInterface $liveStartTime): static
    {
        $this->liveStartTime = $liveStartTime;

        return $this;
    }

    public function getLiveEndTime(): ?\DateTimeInterface
    {
        return $this->liveEndTime;
    }

    public function setLiveEndTime(?\DateTimeInterface $liveEndTime): static
    {
        $this->liveEndTime = $liveEndTime;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

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

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

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

    public function getRessources(): ?string
    {
        return $this->ressources;
    }

    public function setRessources(?string $ressources): self
    {
        $this->ressources = $ressources;

        return $this;
    }

    public function getLiveMeetingLink(): ?string
    {
        return $this->liveMeetingLink;
    }

    public function setLiveMeetingLink(?string $liveMeetingLink): static
    {
        $this->liveMeetingLink = $liveMeetingLink;

        return $this;
    }

    public function getModule(): ?Module
    {
        return $this->module;
    }

    public function setModule(?Module $module): static
    {
        $this->module = $module;

        return $this;
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

    public function getTranslations(): ?array
    {
        return $this->translations;
    }

    public function setTranslations(?array $translations): static
    {
        $this->translations = $translations;

        return $this;
    }

    public function addTranslation(string $language, array $subtitles): void
    {
        $this->translations[$language] = $subtitles;
    }

    public function getTranslation(string $language): ?array
    {
        return $this->translations[$language] ?? null;
    }

    public function getGeneratedNotes(): ?string
    {
        return $this->generatedNotes;
    }

    public function setGeneratedNotes(?string $generatedNotes): static
    {
        $this->generatedNotes = $generatedNotes;

        return $this;
    }

    public function getFullTranscript(): ?string
    {
        return $this->fullTranscript;
    }

    public function setFullTranscript(?string $fullTranscript): static
    {
        $this->fullTranscript = $fullTranscript;

        return $this;
    }
}
