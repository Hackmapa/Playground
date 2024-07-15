<?php

namespace App\Entity;

use App\Repository\NotificationUserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: NotificationUserRepository::class)]
class NotificationUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_detail', 'notification_user_detail'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationUsers')]
    #[Groups(['notification_user_detail'])]
    private ?Notification $notification = null;

    #[ORM\ManyToOne(inversedBy: 'friend')]
    #[Groups(['notification_user_detail'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'notificationFriends')]
    #[Groups(['notification_user_detail'])]
    private ?User $friend = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNotification(): ?Notification
    {
        return $this->notification;
    }

    public function setNotification(?Notification $notification): static
    {
        $this->notification = $notification;

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

    public function getFriend(): ?User
    {
        return $this->friend;
    }

    public function setFriend(?User $friend): static
    {
        $this->friend = $friend;

        return $this;
    }

}
