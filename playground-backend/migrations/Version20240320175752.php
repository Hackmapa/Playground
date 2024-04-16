<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240320175752 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE users_friends DROP FOREIGN KEY FK_D1EE04A3A76ED395');
        $this->addSql('ALTER TABLE users_friends DROP FOREIGN KEY FK_D1EE04A36A5458E8');
        $this->addSql('DROP TABLE users_friends');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE users_friends (user_id INT NOT NULL, friend_id INT NOT NULL, INDEX IDX_D1EE04A3A76ED395 (user_id), INDEX IDX_D1EE04A36A5458E8 (friend_id), PRIMARY KEY(user_id, friend_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE users_friends ADD CONSTRAINT FK_D1EE04A3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_friends ADD CONSTRAINT FK_D1EE04A36A5458E8 FOREIGN KEY (friend_id) REFERENCES user (id)');
    }
}
