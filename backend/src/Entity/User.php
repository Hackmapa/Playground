<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\Email(
        message: 'The email "{{ value }}" is not a valid email.',
    )]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column]
    private ?int $currency = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\ManyToMany(targetEntity: Badges::class, mappedBy: 'user')]
    private Collection $badges;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profile_picture = null;

    #[ORM\OneToMany(targetEntity: NotificationUser::class, mappedBy: 'user')]
    private Collection $notificationUsers;

    #[ORM\OneToMany(targetEntity: NotificationUser::class, mappedBy: 'friend')]
    private Collection $notificationFriends;

    public function __construct()
    {
        $this->badges = new ArrayCollection();
        $this->notificationUsers = new ArrayCollection();
        $this->notificationFriends = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getCurrency(): ?int
    {
        return $this->currency;
    }

    public function setCurrency(int $currency): static
    {
        $this->currency = $currency;

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

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return Collection<int, Badges>
     */
    public function getBadges(): Collection
    {
        return $this->badges;
    }

    public function addBadge(Badges $badge): static
    {
        if (!$this->badges->contains($badge)) {
            $this->badges->add($badge);
            $badge->addUser($this);
        }

        return $this;
    }

    public function removeBadge(Badges $badge): static
    {
        if ($this->badges->removeElement($badge)) {
            $badge->removeUser($this);
        }

        return $this;
    }

    public function getProfilePicture(): ?string
    {
        return $this->profile_picture;
    }

    public function setProfilePicture(?string $profile_picture): static
    {
        $this->profile_picture = $profile_picture;

        return $this;
    }

    public function __toString()
    {
        return $this->getUsername();
    }

    /**
     * @return Collection<int, NotificationUser>
     */
    public function getNotificationUsers(): Collection
    {
        return $this->notificationUsers;
    }

    public function addNotificationUsers(NotificationUser $notificationUsers): static
    {
        if (!$this->notificationUsers->contains($notificationUsers)) {
            $this->notificationUsers->add($notificationUsers);
            $notificationUsers->setUser($this);
        }

        return $this;
    }

    public function removeNotificationUsers(NotificationUser $notificationUsers): static
    {
        if ($this->notificationUsers->removeElement($notificationUsers)) {
            // set the owning side to null (unless already changed)
            if ($notificationUsers->getUser() === $this) {
                $notificationUsers->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, NotificationUser>
     */
    public function getNotificationFriends(): Collection
    {
        return $this->notificationFriends;
    }

    public function addNotificationFriend(NotificationUser $notificationFriend): static
    {
        if (!$this->notificationFriends->contains($notificationFriend)) {
            $this->notificationFriends->add($notificationFriend);
            $notificationFriend->setFriend($this);
        }

        return $this;
    }

    public function removeNotificationFriend(NotificationUser $notificationFriend): static
    {
        if ($this->notificationFriends->removeElement($notificationFriend)) {
            // set the owning side to null (unless already changed)
            if ($notificationFriend->getFriend() === $this) {
                $notificationFriend->setFriend(null);
            }
        }

        return $this;
    }
}
