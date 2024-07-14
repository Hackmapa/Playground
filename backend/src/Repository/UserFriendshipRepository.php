<?php

namespace App\Repository;

use App\Entity\UserFriendship;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserFriendship>
 *
 * @method UserFriendship|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserFriendship|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserFriendship[]    findAll()
 * @method UserFriendship[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserFriendshipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserFriendship::class);
    }

    /**
     * @param int $userId
     * @return UserFriendship[]
     */
    public function findAllFriendshipsByUser(int $userId): array
    {
        $qb = $this->createQueryBuilder('uf')
            ->where('uf.user = :userId')
            ->orWhere('uf.friend = :userId')
            ->setParameter('userId', $userId);

        return $qb->getQuery()->getResult();
    }
}
