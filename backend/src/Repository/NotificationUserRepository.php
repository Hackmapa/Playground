<?php

namespace App\Repository;

use App\Entity\NotificationUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

/**
 * @extends ServiceEntityRepository<NotificationUser>
 *
 * @method NotificationUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method NotificationUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method NotificationUser[]    findAll()
 * @method NotificationUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NotificationUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NotificationUser::class);
    }

    public function findUserNotificationsNotDismissed(User $user)
    {
        return $this->createQueryBuilder('nu')
            ->innerJoin('nu.notification', 'n') // Assurez-vous que 'nu.notification' correspond à votre mappage
            ->where('nu.user = :user')
            ->andWhere('n.is_dismissed = :isDismissed')
            ->setParameter('user', $user)
            ->setParameter('isDismissed', false)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find the most recent NotificationUser for a given user and friend.
     *
     * @param int $userId
     * @param int $friendId
     * @return NotificationUser|null
     */
    public function findMostRecentByUserAndFriend(int $userId, int $friendId): ?NotificationUser
    {
        return $this->createQueryBuilder('n')
            ->where('n.user = :userId')
            ->andWhere('n.friend = :friendId')
            ->setParameter('userId', $userId)
            ->setParameter('friendId', $friendId)
            ->orderBy('n.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

//    public function findOneBySomeField($value): ?NotificationUser
//    {
//        return $this->createQueryBuilder('n')
//            ->andWhere('n.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
