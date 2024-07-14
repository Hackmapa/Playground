<?php

namespace App\Controller;

use App\Repository\BadgesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/badges', name: 'user_')]
class BadgesController extends AbstractController
{
    private $badgesRepository;
    private $serializer;

    public function __construct(BadgesRepository $badgesRepository, SerializerInterface $serializer)
    {
        $this->badgesRepository = $badgesRepository;
        $this->serializer = $serializer;
    }

    #[Route('', name: 'get_badges', methods: ['GET'])]
    public function index(): Response
    {
        $badges = $this->badgesRepository->findAll();

        if (!$badges) {
            return $this->json(['message' => 'Badges not found'], 404);
        }

        $data = $this->serializer->serialize($badges, 'json', ['groups' => 'badges_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}
