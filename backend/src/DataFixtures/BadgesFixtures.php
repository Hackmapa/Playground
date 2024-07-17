<?php
namespace App\DataFixtures;

use App\Entity\Badges;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class BadgesFixtures extends Fixture
{
    
    public function load(ObjectManager $manager): void
    {
        $badge = new Badges();
        $badges = [];

        $badge->setName('Première partie');
        $badge->setTag('first_game');
        $badge->setDescription('Vous avez terminé votre première partie.');
        $badge->setLogo('/badge1.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('Première victoire');
        $badge->setTag('first_win');
        $badge->setDescription('Vous avez remporté votre première partie.');
        $badge->setLogo('/badge2.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('Première défaite');
        $badge->setTag('first_loss');
        $badge->setDescription('Vous avez perdu votre première partie.');
        $badge->setLogo('/badge3.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('Premier ami');
        $badge->setTag('first_friend');
        $badge->setDescription('Vous avez ajouté votre premier ami.');
        $badge->setLogo('/badge4.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('5 parties');
        $badge->setTag('5_games');
        $badge->setDescription('Vous avez joué 5 parties.');
        $badge->setLogo('/badge5.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('5 victoires');
        $badge->setTag('5_wins');
        $badge->setDescription('Vous avez remporté 5 parties.');
        $badge->setLogo('/badge6.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('5 défaites');
        $badge->setTag('5_losses');
        $badge->setDescription('Vous avez perdu 5 parties.');
        $badge->setLogo('/badge7.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        $badges[] = $badge;

        $badge = new Badges();

        $badge->setName('5 amis');
        $badge->setTag('5_friends');
        $badge->setDescription('Vous avez ajouté 5 amis.');
        $badge->setLogo('/badge8.png');
        $badge->setCreatedAt(new \DateTimeImmutable());
        $badge->setUpdatedAt(new \DateTimeImmutable());

        foreach ($badges as $badge) {
            $manager->persist($badge);
        }

        $manager->flush();
    }
}
