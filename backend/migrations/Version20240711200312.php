<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240711200312 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game ADD turn_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318C1F4F9889 FOREIGN KEY (turn_id) REFERENCES turn (id)');
        $this->addSql('CREATE INDEX IDX_232B318C1F4F9889 ON game (turn_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game DROP FOREIGN KEY FK_232B318C1F4F9889');
        $this->addSql('DROP INDEX IDX_232B318C1F4F9889 ON game');
        $this->addSql('ALTER TABLE game DROP turn_id');
    }
}
