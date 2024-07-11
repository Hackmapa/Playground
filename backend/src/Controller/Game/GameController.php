<?php

namespace App\Controller\Game;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\GameRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Game;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;


#[Route('/api/games', name: 'games_')]
class GameController extends AbstractController
{
    private $gameRepository;
    private $entityManager;
    private $userRepository;

    public function __construct(
        GameRepository $gameRepository,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
        )
    {
        $this->gameRepository = $gameRepository;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $games = $this->gameRepository->findAll();

        return $this->json($games, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $players = $data['players'];

        $game = new Game();
        $game->setGameId($data['gameId']);
        $game->setFinished(false);
        $game->setDraw(false);
        foreach ($players as $player) {
            $user = $this->userRepository->find($player['id']);
            $game->addPlayer($user);
        }

        $this->entityManager->persist($game);
        $this->entityManager->flush();

        return $this->json($game, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): Response
    {
        $game = $this->gameRepository->find($id);

        if (!$game) {
            return $this->json(['message' => 'Game not found'], 404);
        }

        return $this->json($game, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): Response
    {
        $game = $this->gameRepository->find($id);

        if (!$game) {
            return $this->json(['message' => 'Game not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['winner'])) {
            $winner = $this->userRepository->find($data['winner']);
            $game->setWinner($winner);
        }

        $game->setFinished($data['finished']);
        $game->setDraw($data['draw']);
        
        $this->entityManager->persist($game);
        $this->entityManager->flush();

        return $this->json($game, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/user/{id}', name: 'user_games', methods: ['GET'])]
    public function userGames(int $id): Response
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $games = $user->getGames();

        return $this->json($games, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }
}
