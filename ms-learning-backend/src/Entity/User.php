<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
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
    #[Groups('user:read', 'forum:read', 'quizscore:read')]
    private ?int $id = null;

    #[ORM\Column(length: 50, type: 'string')]
    #[Assert\NotBlank(message: "Firstname is required")]
    #[Groups('user:read', 'enrolledCourse:read')]
    private ?string $firstname = null;

    #[ORM\Column(length: 50, type: 'string')]
    #[Assert\NotBlank(message: "Lastname is required")]
    #[Groups('user:read', 'enrolledCourse:read')]
    private ?string $lastname = null;

    #[ORM\Column(length: 50, type: 'string', unique: true)]
    #[Assert\NotBlank(message: "Email is required")]
    #[Assert\Email(message: "Invalid email format")]
    #[Groups('user:read')]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups('user:read')]
    private array $roles = [];

    #[ORM\Column(length: 255)]
    #[Groups('user:read')]
    private ?string $picture = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Password is required", groups: ['password_update'])]
    #[Assert\Length(
        min: 8,
        minMessage: "Password must be at least 8 characters long",
        groups: ['password_update']
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[a-z])/",
        message: "Password must contain at least one lowercase letter",
        groups: ['password_update']
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[A-Z])/",
        message: "Password must contain at least one uppercase letter",
        groups: ['password_update']
    )]
    #[Assert\Regex(
        pattern: "/(?=.*\d)/",
        message: "Password must contain at least one number",
        groups: ['password_update']
    )]
    #[Assert\Regex(
        pattern: "/(?=.*[@$!%*?&])/",
        message: "Password must contain at least one special character (@$!%*?&)",
        groups: ['password_update']
    )]

    private ?string $password = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 100)]
    #[Groups('course:read', 'user:read', 'enrolledCourse:read')]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $google_id = null;

    /**
     * @var Collection<int, Courses>
     */
    #[ORM\ManyToMany(targetEntity: Courses::class, mappedBy: 'enrollments')]
    #[Groups('user:read', 'course:read')]
    private Collection $courses;

    /**
     * @var Collection<int, Review>
     */
    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'user')]
    private Collection $reviews;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $X = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $instagram = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $facebook = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $linkedin = null;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'user')]
    private Collection $notifications;

    /**
     * @var Collection<int, Testimonial>
     */
    #[ORM\OneToMany(targetEntity: Testimonial::class, mappedBy: 'user')]
    private Collection $testimonials;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $expertise = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resume = null;

    /**
     * @var Collection<int, InstructorEarning>
     */
    #[ORM\OneToMany(targetEntity: InstructorEarning::class, mappedBy: 'instructor')]
    private Collection $instructorEarnings;

    /**
     * @var Collection<int, UserSubscription>
     */
    #[ORM\OneToMany(targetEntity: UserSubscription::class, mappedBy: 'user')]
    private Collection $userSubscriptions;

    /**
     * @var Collection<int, Payment>
     */
    #[ORM\OneToMany(targetEntity: Payment::class, mappedBy: 'user')]
    private Collection $payments;

    /**
     * @var Collection<int, StudentCourse>
     */
    #[ORM\OneToMany(targetEntity: StudentCourse::class, mappedBy: 'user')]
    private Collection $studentCourses;

    /**
     * @var Collection<int, Calendar>
     */
    #[ORM\OneToMany(targetEntity: Calendar::class, mappedBy: 'user')]
    private Collection $calendars;

    /**
     * @var Collection<int, Module>
     */
    #[ORM\OneToMany(targetEntity: Module::class, mappedBy: 'user')]
    private Collection $modules;

    /**
     * @var Collection<int, Lesson>
     */
    #[ORM\OneToMany(targetEntity: Lesson::class, mappedBy: 'user')]
    private Collection $lessons;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('user:read')]
    private ?string $address = null;

    /**
     * @var Collection<int, Category>
     */
    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'users')]
    private Collection $interests;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $occupation = null;

    #[ORM\Column(nullable: true)]
    private ?array $specialization = null;

    /**
     * @var Collection<int, Post>
     */
    #[ORM\OneToMany(targetEntity: Post::class, mappedBy: 'user')]
    private Collection $posts;

    /**
     * @var Collection<int, Comment>
     */
    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'user')]
    private Collection $comments;

    /**
     * @var Collection<int, CommentReply>
     */
    #[ORM\OneToMany(targetEntity: CommentReply::class, mappedBy: 'user')]
    private Collection $commentReplies;

    /**
     * @var Collection<int, PostLike>
     */
    #[ORM\OneToMany(targetEntity: PostLike::class, mappedBy: 'user')]
    private Collection $postLikes;

    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'following')]
    #[ORM\JoinTable(name: 'user_followers')]
    private Collection $followers;

    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'followers')]
    private Collection $following;

    /**
     * @var Collection<int, ForumPost>
     */
    #[ORM\OneToMany(targetEntity: ForumPost::class, mappedBy: 'user')]
    private Collection $forumPosts;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender')]
    private Collection $messages;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'receiver')]
    private Collection $receivermessages;

    /**
     * @var Collection<int, ChatbotMessage>
     */
    #[ORM\OneToMany(targetEntity: ChatbotMessage::class, mappedBy: 'user')]
    private Collection $chatbotMessages;

    /**
     * @var Collection<int, ChatbotMessage>
     */
    #[ORM\OneToMany(targetEntity: ChatbotMessage::class, mappedBy: 'adminuser')]
    private Collection $chatbotadminResponses;

    /**
     * @var Collection<int, QuizScore>
     */
    #[ORM\OneToMany(targetEntity: QuizScore::class, mappedBy: 'user')]
    private Collection $quizScores;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->courses = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->notifications = new ArrayCollection();
        $this->testimonials = new ArrayCollection();
        $this->instructorEarnings = new ArrayCollection();
        $this->userSubscriptions = new ArrayCollection();
        $this->payments = new ArrayCollection();
        $this->studentCourses = new ArrayCollection();
        $this->calendars = new ArrayCollection();
        $this->modules = new ArrayCollection();
        $this->lessons = new ArrayCollection();
        $this->interests = new ArrayCollection();
        $this->posts = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->commentReplies = new ArrayCollection();
        $this->postLikes = new ArrayCollection();
        $this->followers = new ArrayCollection();
        $this->following = new ArrayCollection();
        $this->forumPosts = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->receivermessages = new ArrayCollection();
        $this->chatbotMessages = new ArrayCollection();
        $this->chatbotadminResponses = new ArrayCollection();
        $this->quizScores = new ArrayCollection();
    }

    public function getFollowers(): Collection
    {
        return $this->followers;
    }

    public function addFollower(self $user): self
    {
        if (!$this->followers->contains($user)) {
            $this->followers->add($user);
        }

        return $this;
    }

    public function removeFollower(self $user): self
    {
        $this->followers->removeElement($user);
        return $this;
    }

    public function getFollowing(): Collection
    {
        return $this->following;
    }

    public function addFollowing(self $user): self
    {
        if (!$this->following->contains($user)) {
            $this->following->add($user);
            $user->addFollower($this);
        }

        return $this;
    }

    public function removeFollowing(self $user): self
    {
        if ($this->following->removeElement($user)) {
            $user->removeFollower($this);
        }

        return $this;
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
        $roles[] = 'ROLE_STUDENT';
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

    /**
     * @return Collection<int, Courses>
     */
    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Courses $course): static
    {
        if (!$this->courses->contains($course)) {
            $this->courses->add($course);
            $course->addEnrollment($this);
        }

        return $this;
    }

    public function removeCourse(Courses $course): static
    {
        if ($this->courses->removeElement($course)) {
            $course->removeEnrollment($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setUser($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getUser() === $this) {
                $review->setUser(null);
            }
        }

        return $this;
    }

    public function getX(): ?string
    {
        return $this->X;
    }

    public function setX(?string $X): static
    {
        $this->X = $X;

        return $this;
    }

    public function getInstagram(): ?string
    {
        return $this->instagram;
    }

    public function setInstagram(?string $instagram): static
    {
        $this->instagram = $instagram;

        return $this;
    }

    public function getFacebook(): ?string
    {
        return $this->facebook;
    }

    public function setFacebook(?string $facebook): static
    {
        $this->facebook = $facebook;

        return $this;
    }

    public function getLinkedin(): ?string
    {
        return $this->linkedin;
    }

    public function setLinkedin(?string $linkedin): static
    {
        $this->linkedin = $linkedin;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Testimonial>
     */
    public function getTestimonials(): Collection
    {
        return $this->testimonials;
    }

    public function addTestimonial(Testimonial $testimonial): static
    {
        if (!$this->testimonials->contains($testimonial)) {
            $this->testimonials->add($testimonial);
            $testimonial->setUser($this);
        }

        return $this;
    }

    public function removeTestimonial(Testimonial $testimonial): static
    {
        if ($this->testimonials->removeElement($testimonial)) {
            // set the owning side to null (unless already changed)
            if ($testimonial->getUser() === $this) {
                $testimonial->setUser(null);
            }
        }

        return $this;
    }

    public function getExpertise(): ?string
    {
        return $this->expertise;
    }

    public function setExpertise(?string $expertise): static
    {
        $this->expertise = $expertise;

        return $this;
    }

    public function getResume(): ?string
    {
        return $this->resume;
    }

    public function setResume(?string $resume): static
    {
        $this->resume = $resume;

        return $this;
    }

    /**
     * @return Collection<int, InstructorEarning>
     */
    public function getInstructorEarnings(): Collection
    {
        return $this->instructorEarnings;
    }

    public function addInstructorEarning(InstructorEarning $instructorEarning): static
    {
        if (!$this->instructorEarnings->contains($instructorEarning)) {
            $this->instructorEarnings->add($instructorEarning);
            $instructorEarning->setInstructor($this);
        }

        return $this;
    }

    public function removeInstructorEarning(InstructorEarning $instructorEarning): static
    {
        if ($this->instructorEarnings->removeElement($instructorEarning)) {
            // set the owning side to null (unless already changed)
            if ($instructorEarning->getInstructor() === $this) {
                $instructorEarning->setInstructor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserSubscription>
     */
    public function getUserSubscriptions(): Collection
    {
        return $this->userSubscriptions;
    }

    public function addUserSubscription(UserSubscription $userSubscription): static
    {
        if (!$this->userSubscriptions->contains($userSubscription)) {
            $this->userSubscriptions->add($userSubscription);
            $userSubscription->setUser($this);
        }

        return $this;
    }

    public function removeUserSubscription(UserSubscription $userSubscription): static
    {
        if ($this->userSubscriptions->removeElement($userSubscription)) {
            // set the owning side to null (unless already changed)
            if ($userSubscription->getUser() === $this) {
                $userSubscription->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Payment>
     */
    public function getPayments(): Collection
    {
        return $this->payments;
    }

    public function addPayment(Payment $payment): static
    {
        if (!$this->payments->contains($payment)) {
            $this->payments->add($payment);
            $payment->setUser($this);
        }

        return $this;
    }

    public function removePayment(Payment $payment): static
    {
        if ($this->payments->removeElement($payment)) {
            // set the owning side to null (unless already changed)
            if ($payment->getUser() === $this) {
                $payment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, StudentCourse>
     */
    public function getStudentCourses(): Collection
    {
        return $this->studentCourses;
    }

    public function addStudentCourse(StudentCourse $studentCourse): static
    {
        if (!$this->studentCourses->contains($studentCourse)) {
            $this->studentCourses->add($studentCourse);
            $studentCourse->setUser($this);
        }

        return $this;
    }

    public function removeStudentCourse(StudentCourse $studentCourse): static
    {
        if ($this->studentCourses->removeElement($studentCourse)) {
            // set the owning side to null (unless already changed)
            if ($studentCourse->getUser() === $this) {
                $studentCourse->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Calendar>
     */
    public function getCalendars(): Collection
    {
        return $this->calendars;
    }

    public function addCalendar(Calendar $calendar): static
    {
        if (!$this->calendars->contains($calendar)) {
            $this->calendars->add($calendar);
            $calendar->setUser($this);
        }

        return $this;
    }

    public function removeCalendar(Calendar $calendar): static
    {
        if ($this->calendars->removeElement($calendar)) {
            // set the owning side to null (unless already changed)
            if ($calendar->getUser() === $this) {
                $calendar->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Module>
     */
    public function getModules(): Collection
    {
        return $this->modules;
    }

    public function addModule(Module $module): static
    {
        if (!$this->modules->contains($module)) {
            $this->modules->add($module);
            $module->setUser($this);
        }

        return $this;
    }

    public function removeModule(Module $module): static
    {
        if ($this->modules->removeElement($module)) {
            // set the owning side to null (unless already changed)
            if ($module->getUser() === $this) {
                $module->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Lesson>
     */
    public function getLessons(): Collection
    {
        return $this->lessons;
    }

    public function addLesson(Lesson $lesson): static
    {
        if (!$this->lessons->contains($lesson)) {
            $this->lessons->add($lesson);
            $lesson->setUser($this);
        }

        return $this;
    }

    public function removeLesson(Lesson $lesson): static
    {
        if ($this->lessons->removeElement($lesson)) {
            // set the owning side to null (unless already changed)
            if ($lesson->getUser() === $this) {
                $lesson->setUser(null);
            }
        }

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getInterests(): Collection
    {
        return $this->interests;
    }

    public function addInterest(Category $interest): static
    {
        if (!$this->interests->contains($interest)) {
            $this->interests->add($interest);
        }

        return $this;
    }

    public function removeInterest(Category $interest): static
    {
        $this->interests->removeElement($interest);

        return $this;
    }

    public function getOccupation(): ?string
    {
        return $this->occupation;
    }

    public function setOccupation(?string $occupation): static
    {
        $this->occupation = $occupation;

        return $this;
    }

    public function getSpecialization(): ?array
    {
        return $this->specialization;
    }

    public function setSpecialization(?array $specialization): static
    {
        $this->specialization = $specialization;

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): static
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): static
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, CommentReply>
     */
    public function getCommentReplies(): Collection
    {
        return $this->commentReplies;
    }

    public function addCommentReply(CommentReply $commentReply): static
    {
        if (!$this->commentReplies->contains($commentReply)) {
            $this->commentReplies->add($commentReply);
            $commentReply->setUser($this);
        }

        return $this;
    }

    public function removeCommentReply(CommentReply $commentReply): static
    {
        if ($this->commentReplies->removeElement($commentReply)) {
            // set the owning side to null (unless already changed)
            if ($commentReply->getUser() === $this) {
                $commentReply->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PostLike>
     */
    public function getPostLikes(): Collection
    {
        return $this->postLikes;
    }

    public function addPostLike(PostLike $postLike): static
    {
        if (!$this->postLikes->contains($postLike)) {
            $this->postLikes->add($postLike);
            $postLike->setUser($this);
        }

        return $this;
    }

    public function removePostLike(PostLike $postLike): static
    {
        if ($this->postLikes->removeElement($postLike)) {
            // set the owning side to null (unless already changed)
            if ($postLike->getUser() === $this) {
                $postLike->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ForumPost>
     */
    public function getForumPosts(): Collection
    {
        return $this->forumPosts;
    }

    public function addForumPost(ForumPost $forumPost): static
    {
        if (!$this->forumPosts->contains($forumPost)) {
            $this->forumPosts->add($forumPost);
            $forumPost->setUser($this);
        }

        return $this;
    }

    public function removeForumPost(ForumPost $forumPost): static
    {
        if ($this->forumPosts->removeElement($forumPost)) {
            // set the owning side to null (unless already changed)
            if ($forumPost->getUser() === $this) {
                $forumPost->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setSender($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getReceivermessages(): Collection
    {
        return $this->receivermessages;
    }

    public function addReceivermessage(Message $receivermessage): static
    {
        if (!$this->receivermessages->contains($receivermessage)) {
            $this->receivermessages->add($receivermessage);
            $receivermessage->setReceiver($this);
        }

        return $this;
    }

    public function removeReceivermessage(Message $receivermessage): static
    {
        if ($this->receivermessages->removeElement($receivermessage)) {
            // set the owning side to null (unless already changed)
            if ($receivermessage->getReceiver() === $this) {
                $receivermessage->setReceiver(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ChatbotMessage>
     */
    public function getChatbotMessages(): Collection
    {
        return $this->chatbotMessages;
    }

    public function addChatbotMessage(ChatbotMessage $chatbotMessage): static
    {
        if (!$this->chatbotMessages->contains($chatbotMessage)) {
            $this->chatbotMessages->add($chatbotMessage);
            $chatbotMessage->setUser($this);
        }

        return $this;
    }

    public function removeChatbotMessage(ChatbotMessage $chatbotMessage): static
    {
        if ($this->chatbotMessages->removeElement($chatbotMessage)) {
            // set the owning side to null (unless already changed)
            if ($chatbotMessage->getUser() === $this) {
                $chatbotMessage->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ChatbotMessage>
     */
    public function getChatbotadminResponses(): Collection
    {
        return $this->chatbotadminResponses;
    }

    public function addChatbotadminResponse(ChatbotMessage $chatbotadminResponse): static
    {
        if (!$this->chatbotadminResponses->contains($chatbotadminResponse)) {
            $this->chatbotadminResponses->add($chatbotadminResponse);
            $chatbotadminResponse->setAdminuser($this);
        }

        return $this;
    }

    public function removeChatbotadminResponse(ChatbotMessage $chatbotadminResponse): static
    {
        if ($this->chatbotadminResponses->removeElement($chatbotadminResponse)) {
            // set the owning side to null (unless already changed)
            if ($chatbotadminResponse->getAdminuser() === $this) {
                $chatbotadminResponse->setAdminuser(null);
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
        if (!$this->quizScores->contains($quizScore)) {
            $this->quizScores->add($quizScore);
            $quizScore->setUser($this);
        }

        return $this;
    }

    public function removeQuizScore(QuizScore $quizScore): static
    {
        if ($this->quizScores->removeElement($quizScore)) {
            // set the owning side to null (unless already changed)
            if ($quizScore->getUser() === $this) {
                $quizScore->setUser(null);
            }
        }

        return $this;
    }
}
