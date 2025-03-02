<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements
    UserInterface,
    PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50, type: 'string')]
    #[Assert\NotBlank(message: "Firstname is required")]
    private ?string $firstname = null;

    #[ORM\Column(length: 50, type: 'string')]
    #[Assert\NotBlank(message: "Lastname is required")]
    private ?string $lastname = null;

    #[ORM\Column(length: 50, type: 'string', unique: true)]
    #[Assert\NotBlank(message: "Email is required")]
    #[Assert\Email(message: "Invalid email format")]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(type: 'string')]
    private ?string $picture = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Password is required")]
    #[Assert\Length(
        min: 8,
        minMessage: "Password must be at least 8 characters long"
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[a-z])/",
        message: "Password must contain at least one lowercase letter"
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[A-Z])/",
        message: "Password must contain at least one uppercase letter"
    )]
    #[Assert\Regex(
        pattern: "/(?=.*\d)/",
        message: "Password must contain at least one number"
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[@$!%*?&])/",
        message: "Password must contain at least one special character (@$!%*?&)"
    )]

    private ?string $password = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 100)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $google_id = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): self
    {
        $this->picture = $picture;
        return $this;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getGoogleId(): ?string
    {
        return $this->google_id;
    }

    public function setGoogleId(?string $google_id): static
    {
        $this->google_id = $google_id;

        return $this;
    }
}
