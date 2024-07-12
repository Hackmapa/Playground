<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $game_id = null;

    #[ORM\Column]
    private ?bool $finished = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'games')]
    private Collection $players;

    #[ORM\OneToMany(targetEntity: Turn::class, mappedBy: 'game')]
    private Collection $turns;

    #[ORM\Column]
    private ?bool $draw = null;

    #[ORM\ManyToOne(inversedBy: 'games')]
    private ?User $winner = null;

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
}
