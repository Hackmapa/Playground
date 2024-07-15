<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_detail', 'game_detail', 'badges_detail', 'friendship_detail', 'notification_user_detail', 'game_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\Email(
        message: 'The email "{{ value }}" is not a valid email.',
    )]
    #[Groups(['user_detail', 'notification_user_detail'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user_detail'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user_detail'])]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user_detail'])]
    private ?int $currency = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_detail', 'game_detail', 'friendship_detail', 'notification_user_detail'])]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_detail'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_detail'])]
    private ?string $lastname = null;

    #[ORM\ManyToMany(targetEntity: Badges::class, mappedBy: 'user')]
    #[Groups(['user_detail'])]
    private Collection $badges;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user_detail', 'game_detail', 'friendship_detail', 'notification_user_detail'])]
    private ?string $profile_picture = null;

    #[ORM\OneToMany(targetEntity: NotificationUser::class, mappedBy: 'user')]
    #[Groups(['user_detail'])]
    private Collection $notificationUsers;

    #[ORM\OneToMany(targetEntity: NotificationUser::class, mappedBy: 'friend')]
    #[Groups(['user_detail'])]
    private Collection $notificationFriends;

    #[ORM\OneToMany(targetEntity: Game::class, mappedBy: 'winner')]
    #[Groups(['user_detail'])]
    private Collection $winnedGames;

    #[ORM\ManyToMany(targetEntity: Game::class, mappedBy: 'players')]
    #[Groups(['user_detail'])]
    private Collection $games;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user_detail'])]
    private ?string $banner = null;

    #[ORM\OneToMany(mappedBy: 'friend', targetEntity: UserFriendship::class)]
    #[Groups(['user_detail'])]
    private Collection $friendships;

    #[ORM\Column]
    #[Groups(['user_detail'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['user_detail'])]
    private ?\DateTimeImmutable $updatedAt = null;


    public function __construct()
    {
        $this->badges = new ArrayCollection();
        $this->notificationUsers = new ArrayCollection();
        $this->notificationFriends = new ArrayCollection();
        $this->winnedGames = new ArrayCollection();
        $this->friendships = new ArrayCollection();
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

    /**
     * @return Collection<int, Game>
     */
    public function getWinnedGames(): Collection
    {
        return $this->winnedGames;
    }

    public function addWinnedGame(Game $winnedGame): static
    {
        if (!$this->winnedGames->contains($winnedGame)) {
            $this->winnedGames->add($winnedGame);
            $winnedGame->setWinner($this);
        }

        return $this;
    }

    public function removeWinnedGame(Game $winnedGame): static
    {
        if ($this->winnedGames->removeElement($winnedGame)) {
            // set the owning side to null (unless already changed)
            if ($winnedGame->getWinner() === $this) {
                $winnedGame->setWinner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getGames(): Collection
    {
        return $this->games;
    }

    public function addGame(Game $game): static
    {
        if (!$this->games->contains($game)) {
            $this->games->add($game);
            $game->addPlayer($this);
        }

        return $this;
    }

    public function removeGame(Game $game): static
    {
        if ($this->games->removeElement($game)) {
            $game->removePlayer($this);
        }

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(string $banner): static
    {
        $this->banner = $banner;

        return $this;
    }

    /**
     * @return Collection<int, UserFriendship>
     */
    public function getFriendships(): Collection
    {
        return $this->friendships;
    }

    public function addFriendship(UserFriendship $friendship): static
    {
        if (!$this->friendships->contains($friendship)) {
            $this->friendships->add($friendship);
            $friendship->setFriend($this);
        }

        return $this;
    }

    public function removeFriendship(UserFriendship $friendship): static
    {
        if ($this->friendships->removeElement($friendship)) {
            if ($friendship->getFriend() === $this) {
                $friendship->setFriend(null);
            }
        }

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
