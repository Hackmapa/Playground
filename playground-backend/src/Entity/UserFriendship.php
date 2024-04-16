<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserFriendshipRepository;


#[ORM\Entity(repositoryClass: UserFriendshipRepository::class)]
class UserFriendship
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $friend;

    #[ORM\Column(type: 'boolean')]
    private ?bool $pending;

    #[ORM\Column(type: 'boolean')]
    private bool $accepted = false; // Default to false, assuming all new requests are not accepted

//    public function __construct()
//    {
//        $this->user = $this->getUser();
//        $this->friend = $this->getFriend();
//    }

    // Getters and setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFriend(): ?User
    {
        return $this->friend;
    }

    public function setFriend(?User $friend): self
    {
        $this->friend = $friend;

        return $this;
    }

    public function getPending(): ?bool
    {
        return $this->pending;
    }

    public function setPending(bool $pending): self
    {
        $this->pending = $pending;

        return $this;
    }

    // Other methods

    public function acceptFriendship(): void
    {
        $this->pending = false;
    }

    public function rejectFriendship(): void
    {
        $this->pending = false;
    }

    public function isPending(): bool
    {
        return $this->pending;
    }


    public function isFriendOf(User $user): bool
    {
        return $this->user === $user || $this->friend === $user;
    }

    public function getAccepted(): bool
    {
        return $this->accepted;
    }
    

    public function reject(): void
    {
        $this->accepted = false;
    }
  
    public function setAccepted(bool $accepted): self
    {
        $this->accepted = $accepted;
        return $this;
    }
}
