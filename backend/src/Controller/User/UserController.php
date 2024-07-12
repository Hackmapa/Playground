<?php

namespace App\Controller\User;

use App\Controller\BaseController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Psr\Log\LoggerInterface;

#[Route('/api/users', name: 'user_')]
class UserController extends BaseController
{
    private $userRepository;
    private $entityManager;
    private $userPasswordHasher;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordHasher = $userPasswordHasher;
    }

    #[Route('/me', name: 'get_actual_user', methods: ['GET'])]
    public function getActualUser(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        return $this->json($user, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('/{id}', name: 'get_user', methods: ['GET'])]
    public function getSingleUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        return $this->json($user, 200, [], ['circular_reference_handler' => function ($object) {
            return $object->getId();
        }]);
    }

    #[Route('', name: 'get_users', methods: ['GET'])]
    public function getUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        if (!$users) {
            return $this->json(['message' => 'Users not found'], 404);
        }

        return $this->json($users);
    }

    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return $this->json($user);
    }

    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        empty($data['email']) ? true : $user->setEmail($data['email']);
        empty($data['password']) ? true : $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json($user);
    }

    #[Route('/{id}/profile-picture', name: 'update_profile_picture', methods: ['POST'])]
    public function updateProfilePicture(int $id, Request $request, EntityManagerInterface $em, LoggerInterface $logger)
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        $file = $request->files->get('profile_picture');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        $uploadsDirectory = $this->getParameter('uploads_directory');

        $filename = md5(uniqid()) . '.' . $file->guessExtension();
        

        try {
            $file->move($uploadsDirectory, $filename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Failed to upload file'], 500);
        }

        $profilePictureUrl = $this->generateUrl('uploaded_file', ['filename' => $filename], \Symfony\Component\Routing\Generator\UrlGeneratorInterface::ABSOLUTE_URL);

        $user->setProfilePicture($profilePictureUrl);
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['success' => true, 'profile_picture_url' => $profilePictureUrl]);
    }
}
