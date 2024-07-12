<?php

namespace App\Controller\Turn;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\GameRepository;
use App\Repository\TurnRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Turn;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/turns', name: 'turns_')]
class TurnController extends AbstractController
{
    private $gameRepository;
    private $turnRepository;
    private $entityManager;

    public function __construct(GameRepository $gameRepository, TurnRepository $turnRepository, EntityManagerInterface $entityManager)
    {
        $this->gameRepository = $gameRepository;
        $this->turnRepository = $turnRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/{game_id}', name: 'get_turns', methods: ['GET'])]
    public function index(int $game_id): Response
    {
        $game = $this->gameRepository->find($game_id);

        if (!$game) {
            return $this->json(['message' => 'Game not found'], 404);
        }

        $turns = $this->turnRepository->findBy(['game' => $game]);

        if (!$turns) {
            return $this->json(['message' => 'Turns not found'], 404);
        }

        return $this->json($turns);
    }

    #[Route('/{game_id}', name: 'create_turn', methods: ['POST'])]
    public function create(int $game_id, Request $request): Response
    {
        $game = $this->gameRepository->find($game_id);

        if (!$game) {
            return $this->json(['message' => 'Game not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $turn = new Turn();
        $turn->setGame($game);
        $turn->setTimestamp(new \DateTime());
        $turn->setState($data);
        
        $this->entityManager->persist($turn);
        $this->entityManager->flush();

        return $this->json($turn, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }
}
