<?php

namespace App\Controller\Badge;

use App\Controller\BaseController;
use App\Entity\Badges;
use App\Repository\BadgesRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/badges', name: 'badge_')]
class BadgeController extends BaseController
{
    private $userRepository;
    private $badgeRepository;
    private $serializer;

    private $entityManager;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager, BadgesRepository $badgeRepository, SerializerInterface $serializer)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->badgeRepository = $badgeRepository;
        $this->serializer = $serializer;
    }

    #[Route('', name: 'get_badges', methods: ['GET'])]
    public function index(): Response
    {
        $badges = $this->badgeRepository->findAll();

        if (!$badges) {
            return $this->json([], 200);
        }

        $data = $this->serializer->serialize($badges, 'json', ['groups' => 'badges_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/add/{userId}/{id}', name: 'add_badge', methods: ['PUT'])]
    public function addBadge(int $userId, int $id): JsonResponse
    {
        $user = $this->userRepository->find($userId);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $badge = $this->badgeRepository->find($id);

        if (!$badge) {
            return $this->json(['message' => 'Badge not found'], 404);
        }

        $user->addBadge($badge);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json($user, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/remove/{userId}/{id}', name: 'remove_badge', methods: ['PUT'])]
    public function removeBadge(int $userId, int $id): JsonResponse
    {
        $user = $this->userRepository->find($userId);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $badge = $this->badgeRepository->find($id);

        if (!$badge) {
            return $this->json(['message' => 'Badge not found'], 404);
        }

        $user->removeBadge($badge);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json($user, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/create', name: 'create_badge', methods: ['POST'])]
    public function createBadge(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $badge = new Badges();
        empty($data['name']) ? true : $badge->setName($data['name']);
        empty($data['description']) ? true : $badge->setDescription($data['description']);
        empty($data['logo']) ? true : $badge->setLogo($data['logo']);
        $badge->setCreatedAt(new \DateTimeImmutable('now'));
        $badge->setUpdatedAt(new \DateTimeImmutable('now'));

        $this->entityManager->persist($badge);
        $this->entityManager->flush();

        return $this->json($badge);
    }



}
