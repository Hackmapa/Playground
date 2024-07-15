<?php

namespace App\Controller\Friend;

use App\Controller\BaseController;
use App\Entity\User;
use App\Entity\UserFriendship;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Notification;
use App\Entity\NotificationUser;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\UserFriendshipRepository;

#[Route('/api/friends', name: 'friends_')]
class FriendController extends BaseController
{
    private $userRepository;
    private $userFriendshipRepository;
    private $serializer;

    public function __construct(
        UserRepository $userRepository,
        UserFriendshipRepository $userFriendshipRepository,
        SerializerInterface $serializer
    )
    {
        $this->userRepository = $userRepository;
        $this->userFriendshipRepository = $userFriendshipRepository;
        $this->serializer = $serializer;
    }

    #[Route('/{id}', name: 'get_friends', methods: ['GET'])]
    public function getFriends(int $id): Response
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'message' => 'User not found', 
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }

        $friends = $this->userFriendshipRepository->findAllFriendshipsByUser($id);
        
        $data = $this->serializer->serialize($friends, 'json', ['groups' => 'friendship_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}/add/{friendId}', name: 'add_friend', methods: ['POST'])]
    public function sendFriendRequest(int $id, int $friendId, EntityManagerInterface $entityManager): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);
        $friend = $entityManager->getRepository(User::class)->find($friendId);

        if (!$user) {
            return $this->json([
                'message' => 'User not found.', 
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }

        if (!$friend) {
            return $this->json([
                'message' => 'Friend not found.', 
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }

        $friendship = $entityManager->getRepository(UserFriendship::class)->findOneBy([
            'user' => $id,
            'friend' => $friendId
        ]);

        if ($friendship) {
            return $this->json([
                'message' => 'Friendship already exists.', 
                'status' => Response::HTTP_CONFLICT
            ]);
        }

        $friendship = new UserFriendship();
        $friendship->setUser($user);
        $friendship->setFriend($friend);
        $friendship->setPending(true);
        $friendship->setAccepted(false);

        $notification = new Notification();
        $notification->setType('friend_request');
        $notification->setDescription('You have a new friend request from ');
        $notification->setLink('');
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setUpdatedAt(new \DateTimeImmutable());
        $notification->setIsNew(true);
        $notification->setIsDismissed(false);

        $notificationUser = new NotificationUser();
        $notificationUser->setUser($friend);
        $notificationUser->setNotification($notification);
        $notificationUser->setFriend($user);

        $entityManager->persist($friendship);
        $entityManager->persist($notification);
        $entityManager->persist($notificationUser);
        $entityManager->flush();

        $data = $this->serializer->serialize($notificationUser, 'json', ['groups' => 'notification_user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}/accept/{friendId}', name: 'accept_friend_request', methods: ['POST'])]
    public function acceptFriendRequest(int $id, int $friendId, EntityManagerInterface $entityManager): Response
    {
        $user = $this->userRepository->find($id);
        $friend = $this->userRepository->find($friendId);

        $notificationUser = $entityManager->getRepository(NotificationUser::class)->findOneBy([
            'user' => $id,
            'friend' => $friendId,
        ]);

        $notification = $notificationUser->getNotification();

        $friendship = $entityManager->getRepository(UserFriendship::class)->findOneBy([
            'user' => $friendId,
            'friend' => $id
        ]);

        if (!$friendship) {
            return $this->json([
                'message' => 'Friendship not found.', 
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }

        $friendship->setPending(false);
        $friendship->setAccepted(true);

        $notification->setIsNew(false);
        $notification->setIsDismissed(true);

        $newNotification = new Notification();
        $newNotification->setType('friend_request_accepted');
        $newNotification->setDescription('You are now friends with ');
        $newNotification->setLink('');
        $newNotification->setCreatedAt(new \DateTimeImmutable());
        $newNotification->setUpdatedAt(new \DateTimeImmutable());
        $newNotification->setIsNew(true);
        $newNotification->setIsDismissed(false);
        
        $notificationUser = new NotificationUser();
        $notificationUser->setUser($friend);
        $notificationUser->setFriend($user);
        $notificationUser->setNotification($newNotification);

        $entityManager->persist($newNotification);
        $entityManager->persist($notificationUser);
        $entityManager->flush();

        $data = $this->serializer->serialize($notificationUser, 'json', ['groups' => 'notification_user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}/decline/{friendId}', name: 'decline_friend_request', methods: ['POST'])]
    public function declineFriendRequest(int $id, int $friendId, EntityManagerInterface $entityManager): Response
    {
        $user = $this->userRepository->find($id);
        $friend = $this->userRepository->find($friendId);

        $notificationUser = $entityManager->getRepository(NotificationUser::class)->findOneBy([
            'user' => $id,
            'friend' => $friendId,
        ]);

        $notification = $notificationUser->getNotification();

        $friendship = $entityManager->getRepository(UserFriendship::class)->findOneBy([
            'user' => $friendId,
            'friend' => $id
        ]);

        if (!$friendship) {
            return $this->json([
                'message' => 'Friendship not found.', 
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }
        
        $notification->setIsNew(false);
        $notification->setIsDismissed(true);

        $newNotification = new Notification();
        $newNotification->setType('friend_request_declined');
        $newNotification->setDescription('Your friend request has been declined by ');
        $newNotification->setLink('');
        $newNotification->setCreatedAt(new \DateTimeImmutable());
        $newNotification->setUpdatedAt(new \DateTimeImmutable());
        $newNotification->setIsNew(true);
        $newNotification->setIsDismissed(false);

        $notificationUser = new NotificationUser();
        $notificationUser->setUser($friend);
        $notificationUser->setFriend($user);
        $notificationUser->setNotification($newNotification);

        $entityManager->remove($friendship);  
        $entityManager->persist($newNotification);
        $entityManager->persist($notificationUser);  
        $entityManager->flush();

        $data = $this->serializer->serialize($notificationUser, 'json', ['groups' => 'notification_user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}
