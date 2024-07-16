<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['game_detail', 'game_list', 'user_detail'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['game_detail', 'game_list'])]
    private ?int $game_id = null;

    #[ORM\Column]
    #[Groups(['game_detail', 'game_list'])]
    private ?bool $finished = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'games')]
    #[Groups(['game_detail', 'game_list'])]
    private Collection $players;

    #[ORM\OneToMany(targetEntity: Turn::class, mappedBy: 'game')]
    #[Groups(['game_detail', 'game_list'])]
    private Collection $turns;

    #[ORM\Column]
    #[Groups(['game_detail', 'game_list'])]
    private ?bool $draw = null;

    #[ORM\ManyToOne(inversedBy: 'games')]
    #[Groups(['game_detail', 'game_list'])]
    private ?User $winner = null;

    #[ORM\Column]
    #[Groups(['game_detail', 'game_list'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $game_tag = null;

    public function __construct()
    {
        $this->players = new ArrayCollection();
        $this->turns = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGameId(): ?int
    {
        return $this->game_id;
    }

    public function setGameId(int $game_id): static
    {
        $this->game_id = $game_id;

        return $this;
    }

    public function isFinished(): ?bool
    {
        return $this->finished;
    }

    public function setFinished(bool $finished): static
    {
        $this->finished = $finished;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getPlayers(): Collection
    {
        return $this->players;
    }

    public function addPlayer(User $player): static
    {
        if (!$this->players->contains($player)) {
            $this->players->add($player);
        }

        return $this;
    }

    public function removePlayer(User $player): static
    {
        $this->players->removeElement($player);

        return $this;
    }

    /**
     * @return Collection<int, Turn>
     */
    public function getTurns(): Collection
    {
        return $this->turns;
    }

    public function addTurn(Turn $turn): static
    {
        if (!$this->turns->contains($turn)) {
            $this->turns->add($turn);
            $turn->setGame($this);
        }

        return $this;
    }

    public function removeTurn(Turn $turn): static
    {
        if ($this->turns->removeElement($turn)) {
            // set the owning side to null (unless already changed)
            if ($turn->getGame() === $this) {
                $turn->setGame(null);
            }
        }

        return $this;
    }

    public function isDraw(): ?bool
    {
        return $this->draw;
    }

    public function setDraw(bool $draw): static
    {
        $this->draw = $draw;

        return $this;
    }

    public function getWinner(): ?User
    {
        return $this->winner;
    }

    public function setWinner(?User $winner): static
    {
        $this->winner = $winner;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getGameTag(): ?string
    {
        return $this->game_tag;
    }

    public function setGameTag(string $game_tag): static
    {
        $this->game_tag = $game_tag;

        return $this;
    }
}
