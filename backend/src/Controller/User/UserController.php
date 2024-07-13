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
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/users', name: 'user_')]
class UserController extends BaseController
{
    private $userRepository;
    private $entityManager;
    private $userPasswordHasher;
    private $serializer;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher, SerializerInterface $serializer)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordHasher = $userPasswordHasher;
        $this->serializer = $serializer;
    }

    #[Route('/me', name: 'get_actual_user', methods: ['GET'])]
    public function getActualUser(): Response
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $data = $this->serializer->serialize($user, 'json', ['groups' => 'user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'get_user', methods: ['GET'])]
    public function getSingleUser(int $id): Response
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $data = $this->serializer->serialize($user, 'json', ['groups' => 'user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('', name: 'get_users', methods: ['GET'])]
    public function getUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        if (!$users) {
            return $this->json(['message' => 'Users not found'], 404);
        }
        
        $data = $this->serializer->serialize($users, 'json', ['groups' => 'user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): Response
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        $data = $this->serializer->serialize($user, 'json', ['groups' => 'user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(int $id, Request $request): Response
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        empty($data['email']) ? true : $user->setEmail($data['email']);
        if (!empty($data['password'] && strlen($data['password']) > 0)) {
            $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));
        }
        empty($data['password']) ? true : $user->setPassword($this->userPasswordHasher->hashPassword($user, $data['password']));
        empty($data['currency']) ? true : $user->setCurrency($data['currency']);
        empty($data['username']) ? true : $user->setUsername($data['username']);
        empty($data['firstname']) ? true : $user->setFirstname($data['firstname']);
        empty($data['lastname']) ? true : $user->setLastname($data['lastname']);
        empty($data['roles']) ? true : $user->setRoles($data['roles']);
        empty($data['updated_at']) ? true : $user->setUpdatedAt($data['updated_at']);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $data = $this->serializer->serialize($user, 'json', ['groups' => 'user_detail']);

        return new Response($data, 200, ['Content-Type' => 'application/json']);
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
