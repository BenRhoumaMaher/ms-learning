<?php

namespace App\Service\MailService;

interface MailServiceInterface
{
    /**
     * @param string $to
     * @param string $username
     * @param string $subject
     * @param string $template
     * @param array<string, mixed> $vars Associative array of variables for the template
     */
    public function sendEmail(
        string $to,
        string $username,
        string $subject,
        string $template,
        array $vars = []
    ): void;
}
