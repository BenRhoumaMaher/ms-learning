<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250423171911 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE forum_post_category (forum_post_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_51219AA5BA454E5D (forum_post_id), INDEX IDX_51219AA512469DE2 (category_id), PRIMARY KEY(forum_post_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE forum_post_category ADD CONSTRAINT FK_51219AA5BA454E5D FOREIGN KEY (forum_post_id) REFERENCES forum_post (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE forum_post_category ADD CONSTRAINT FK_51219AA512469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE forum_post ADD tags VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE forum_post_category DROP FOREIGN KEY FK_51219AA5BA454E5D');
        $this->addSql('ALTER TABLE forum_post_category DROP FOREIGN KEY FK_51219AA512469DE2');
        $this->addSql('DROP TABLE forum_post_category');
        $this->addSql('ALTER TABLE forum_post DROP tags');
    }
}
