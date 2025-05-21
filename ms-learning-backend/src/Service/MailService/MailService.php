<?php

namespace App\Service\MailService;

use App\Classe\Mail;

class MailService implements MailServiceInterface
{
    private Mail $mail;

    public function __construct()
    {
        $this->mail = new Mail();
    }

    /**
     * @param array<string, mixed> $vars  Associative array of variables for the template
     */
    public function sendEmail(
        string $to,
        string $username,
        string $subject,
        string $template,
        array $vars = []
    ): void {
        $this->mail->send(
            $to,
            $username,
            $subject,
            $template,
            $vars
        );
    }
}
