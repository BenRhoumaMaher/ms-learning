<?php

namespace App\Service;

use Src\Classe\Mail;

class MailService
{
    private Mail $mail;

    public function __construct()
    {
        $this->mail = new Mail();
    }

    public function sendEmail(string $to, string $username, string $subject, string $template, array $vars = []): void
    {
        $this->mail->send($to, $username, $subject, $template, $vars);
    }
}
