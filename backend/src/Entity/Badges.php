<?php

namespace App\Entity;

use App\Repository\BadgesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BadgesRepository::class)]
class Badges
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['badges_detail', 'user_detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['badges_detail'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['badges_detail'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['badges_detail'])]
    private ?string $logo = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'badges')]
    #[Groups(['badges_detail'])]
    private Collection $user;

    #[ORM\Column]
    #[Groups(['badges_detail'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    #[Groups(['badges_detail'])]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\Column(length: 255)]
    #[Groups(['badges_detail', 'user_detail'])]
    private ?string $tag = null;

    public function __construct()
    {
        $this->user = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(string $logo): static
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->user;
    }

    public function addUser(User $user): static
    {
        if (!$this->user->contains($user)) {
            $this->user->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->user->removeElement($user);

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }
    public function __toString()
    {
        return $this->getName();
    }

    public function getTag(): ?string
    {
        return $this->tag;
    }

    public function setTag(string $tag): static
    {
        $this->tag = $tag;

        return $this;
    }
}
