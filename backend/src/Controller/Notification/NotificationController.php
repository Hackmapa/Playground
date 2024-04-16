<?php

namespace App\Controller\Notification;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Notification;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserRepository;
use App\Entity\NotificationUser;
use App\Repository\NotificationUserRepository;

#[Route('/api/notification', name: 'notification_')]
class NotificationController extends AbstractController
{

    private $notificationRepository;
    private $entityManager;
    private $userRepository;
    private $notificationUserRepository;

    public function __construct(
        NotificationRepository $notificationRepository, 
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        NotificationUserRepository $notificationUserRepository
    )
    {
        $this->notificationRepository = $notificationRepository;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->notificationUserRepository = $notificationUserRepository;
    }

    #[Route('/{user_id}', name: 'get_notifications', methods: ['GET'])]
    public function getNotifications(int $user_id): Response
    {
        $user = $this->userRepository->find($user_id);

        if (!$user) {
            return $this->json([
                'message' => 'User not found',
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }

        // i need to filter by user, and by is_dismissed
        $notifications = $this->notificationUserRepository->findUserNotificationsNotDismissed($user);

        return $this->json($notifications, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }


    #[Route('/{userId}', name: 'create', methods: ['POST'])]
    public function create(int $userId, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['type'], $data['link'], $data['description'])) {
            return $this->json(['message' => 'Données manquantes.'], Response::HTTP_BAD_REQUEST);
        }
    
        $user = $this->userRepository->find($userId);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur non trouvé.'], Response::HTTP_NOT_FOUND);
        }
    
        $notification = new Notification();

        $notification->setType($data['type']);
        $notification->setLink($data['link']);
        $notification->setDescription($data['description']);
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setUpdatedAt(new \DateTimeImmutable());
        $notification->setIsNew(true);
        $notification->setIsDismissed(false);
    
        $notificationUser = new NotificationUser();
        $notificationUser->setNotification($notification);
        $notificationUser->setUser($user);
        
        if (isset($data['friend_id']) && $notification->getType() === 'friend_request') {
            $friend = $this->userRepository->find($data['friend_id']);
            if (!$friend) {
                return $this->json(['message' => 'Ami non trouvé.'], Response::HTTP_NOT_FOUND);
            }
            $notificationUser->setFriend($friend);
            $notification->setDescription($friend->getUsername() . ' vous a envoyé une demande d\'ami.');
        }
        
        $this->entityManager->persist($notification);
        $this->entityManager->persist($notificationUser);
        $this->entityManager->flush();
    
        return $this->json($notification, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }
    
    
}
