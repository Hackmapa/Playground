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

    //    /**
    //     * @return UserFriendship[] Returns an array of UserFriendship objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Badges
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
