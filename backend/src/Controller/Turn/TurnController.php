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
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/turns', name: 'turns_')]
class TurnController extends AbstractController
{
    private $gameRepository;
    private $turnRepository;
    private $entityManager;
    private $serializer;


    public function __construct(GameRepository $gameRepository, TurnRepository $turnRepository, EntityManagerInterface $entityManager, SerializerInterface $serializerInterface)
    {
        $this->gameRepository = $gameRepository;
        $this->turnRepository = $turnRepository;
        $this->entityManager = $entityManager;
        $this->serializer = $serializerInterface;
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

        $data = $this->serializer->serialize($turns, 'json', ['groups' => 'turn_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
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

        $data = $this->serializer->serialize($turn, 'json', ['groups' => 'turn_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}
