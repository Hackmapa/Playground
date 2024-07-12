<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240711200159 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game_user (game_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_6686BA65E48FD905 (game_id), INDEX IDX_6686BA65A76ED395 (user_id), PRIMARY KEY(game_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game_user ADD CONSTRAINT FK_6686BA65E48FD905 FOREIGN KEY (game_id) REFERENCES game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_user ADD CONSTRAINT FK_6686BA65A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game ADD winner_id INT DEFAULT NULL, ADD loser_id INT DEFAULT NULL, ADD game_id INT NOT NULL, ADD finished TINYINT(1) NOT NULL, DROP name, DROP description, DROP link, DROP image, DROP players');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318C5DFCD4B8 FOREIGN KEY (winner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318C1BCAA5F6 FOREIGN KEY (loser_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_232B318C5DFCD4B8 ON game (winner_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_232B318C1BCAA5F6 ON game (loser_id)');
        $this->addSql('ALTER TABLE turn DROP FOREIGN KEY FK_20201547E48FD905');
        $this->addSql('DROP INDEX IDX_20201547E48FD905 ON turn');
        $this->addSql('ALTER TABLE turn DROP game_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_user DROP FOREIGN KEY FK_6686BA65E48FD905');
        $this->addSql('ALTER TABLE game_user DROP FOREIGN KEY FK_6686BA65A76ED395');
        $this->addSql('DROP TABLE game_user');
        $this->addSql('ALTER TABLE game DROP FOREIGN KEY FK_232B318C5DFCD4B8');
        $this->addSql('ALTER TABLE game DROP FOREIGN KEY FK_232B318C1BCAA5F6');
        $this->addSql('DROP INDEX UNIQ_232B318C5DFCD4B8 ON game');
        $this->addSql('DROP INDEX UNIQ_232B318C1BCAA5F6 ON game');
        $this->addSql('ALTER TABLE game ADD name VARCHAR(255) NOT NULL, ADD description VARCHAR(255) NOT NULL, ADD link VARCHAR(255) NOT NULL, ADD image VARCHAR(255) NOT NULL, ADD players VARCHAR(255) NOT NULL, DROP winner_id, DROP loser_id, DROP game_id, DROP finished');
        $this->addSql('ALTER TABLE turn ADD game_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE turn ADD CONSTRAINT FK_20201547E48FD905 FOREIGN KEY (game_id) REFERENCES game (id)');
        $this->addSql('CREATE INDEX IDX_20201547E48FD905 ON turn (game_id)');
    }
}
