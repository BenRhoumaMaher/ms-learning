<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250430104118 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE chatbot_message (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, adminuser_id INT DEFAULT NULL, message LONGTEXT NOT NULL, response LONGTEXT DEFAULT NULL, is_read TINYINT(1) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', respond_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_EDF1E884A76ED395 (user_id), INDEX IDX_EDF1E88439505EF (adminuser_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE chatbot_message ADD CONSTRAINT FK_EDF1E884A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE chatbot_message ADD CONSTRAINT FK_EDF1E88439505EF FOREIGN KEY (adminuser_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chatbot_message DROP FOREIGN KEY FK_EDF1E884A76ED395');
        $this->addSql('ALTER TABLE chatbot_message DROP FOREIGN KEY FK_EDF1E88439505EF');
        $this->addSql('DROP TABLE chatbot_message');
    }
}
