<?php

namespace App\Entity;

use App\Repository\InstructorEarningRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InstructorEarningRepository::class)]
class InstructorEarning
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'instructorEarnings')]
    private ?User $instructor = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $totalEarnings = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lastpaymentdate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $nextpaymentdate = null;

    #[ORM\Column(length: 50)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInstructor(): ?User
    {
        return $this->instructor;
    }

    public function setInstructor(?User $instructor): static
    {
        $this->instructor = $instructor;

        return $this;
    }

    public function getTotalEarnings(): ?string
    {
        return $this->totalEarnings;
    }

    public function setTotalEarnings(string $totalEarnings): static
    {
        $this->totalEarnings = $totalEarnings;

        return $this;
    }

    public function getLastpaymentdate(): ?\DateTimeInterface
    {
        return $this->lastpaymentdate;
    }

    public function setLastpaymentdate(?\DateTimeInterface $lastpaymentdate): static
    {
        $this->lastpaymentdate = $lastpaymentdate;

        return $this;
    }

    public function getNextpaymentdate(): ?\DateTimeInterface
    {
        return $this->nextpaymentdate;
    }

    public function setNextpaymentdate(?\DateTimeInterface $nextpaymentdate): static
    {
        $this->nextpaymentdate = $nextpaymentdate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

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
}
