<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240321153901 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CA6A5458E8');
        $this->addSql('DROP INDEX UNIQ_BF5476CA6A5458E8 ON notification');
        $this->addSql('ALTER TABLE notification DROP friend_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification ADD friend_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA6A5458E8 FOREIGN KEY (friend_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BF5476CA6A5458E8 ON notification (friend_id)');
    }
}
