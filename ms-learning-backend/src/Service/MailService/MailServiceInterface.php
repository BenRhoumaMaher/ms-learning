<?php

namespace App\Service\MailService;

interface MailServiceInterface
{
    public function sendEmail(
        string $to,
        string $username,
        string $subject,
        string $template,
        array $vars = []
    ): void;
}
