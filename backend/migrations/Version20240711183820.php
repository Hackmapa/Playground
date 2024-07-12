<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240711183820 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE history (id INT AUTO_INCREMENT NOT NULL, winner_id INT DEFAULT NULL, loser_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_27BA704B5DFCD4B8 (winner_id), UNIQUE INDEX UNIQ_27BA704B1BCAA5F6 (loser_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE history_game (history_id INT NOT NULL, game_id INT NOT NULL, INDEX IDX_281E41F01E058452 (history_id), INDEX IDX_281E41F0E48FD905 (game_id), PRIMARY KEY(history_id, game_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE history ADD CONSTRAINT FK_27BA704B5DFCD4B8 FOREIGN KEY (winner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE history ADD CONSTRAINT FK_27BA704B1BCAA5F6 FOREIGN KEY (loser_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE history_game ADD CONSTRAINT FK_281E41F01E058452 FOREIGN KEY (history_id) REFERENCES history (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE history_game ADD CONSTRAINT FK_281E41F0E48FD905 FOREIGN KEY (game_id) REFERENCES game (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE history DROP FOREIGN KEY FK_27BA704B5DFCD4B8');
        $this->addSql('ALTER TABLE history DROP FOREIGN KEY FK_27BA704B1BCAA5F6');
        $this->addSql('ALTER TABLE history_game DROP FOREIGN KEY FK_281E41F01E058452');
        $this->addSql('ALTER TABLE history_game DROP FOREIGN KEY FK_281E41F0E48FD905');
        $this->addSql('DROP TABLE history');
        $this->addSql('DROP TABLE history_game');
    }
}
