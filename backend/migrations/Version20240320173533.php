<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240320173533 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_friendship (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, friend_id INT NOT NULL, pending TINYINT(1) NOT NULL, accepted TINYINT(1) NOT NULL, INDEX IDX_D55362B3A76ED395 (user_id), INDEX IDX_D55362B36A5458E8 (friend_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_friendship ADD CONSTRAINT FK_D55362B3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_friendship ADD CONSTRAINT FK_D55362B36A5458E8 FOREIGN KEY (friend_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_friendship DROP FOREIGN KEY FK_D55362B3A76ED395');
        $this->addSql('ALTER TABLE user_friendship DROP FOREIGN KEY FK_D55362B36A5458E8');
        $this->addSql('DROP TABLE user_friendship');
    }
}
