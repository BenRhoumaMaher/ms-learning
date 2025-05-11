<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250510092754 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lesson ADD total_views INT DEFAULT 0 NOT NULL, ADD total_watch_time INT DEFAULT 0 NOT NULL, ADD total_pauses INT DEFAULT 0 NOT NULL, ADD total_replays INT DEFAULT 0 NOT NULL, ADD average_completion DOUBLE PRECISION DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lesson DROP total_views, DROP total_watch_time, DROP total_pauses, DROP total_replays, DROP average_completion');
    }
}
