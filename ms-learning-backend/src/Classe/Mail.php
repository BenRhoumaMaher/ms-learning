<?php

/**
 * This file defines the Mail class,
 * responsible for handling email sending functionality using Mailjet API.
 * It supports template-based emails with variable substitution.
 *
 * @category Classes
 * @package  App\Classe
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://dev.mailjet.com/email/guides/
 */

namespace App\Classe;

use Mailjet\Client;
use Mailjet\Resources;

/**
 * Handles email sending through Mailjet API service.
 * Supports template rendering with dynamic variable replacement.
 * Can be disabled for testing purposes.
 *
 * @category Classes
 * @package  App\Classe
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://dev.mailjet.com/email/guides/
 */
class Mail
{
    private bool $enabled;

    /**
     * @param bool $enabled Whether email sending should be enabled (default: true).
     */
    public function __construct(bool $enabled = true)
    {
        $this->enabled = $enabled;
    }

    /**
     * Sends an email using Mailjet API.
     *
     * @param string     $to_email Recipient email address.
     * @param string     $to_name  Recipient name.
     * @param string     $subject  Email subject.
     * @param string     $template Path to the email template file.
     * @param array|null $vars     Optional variables for template substitution.
     */
    public function send(
        $to_email,
        $to_name,
        $subject,
        $template,
        $vars = null
    ) {
        $content = file_get_contents(dirname(__DIR__) . '/Mail/' . $template);

        if ($vars) {
            foreach ($vars as $key => $var) {
                $content = str_replace('{' . $key . '}', $var, $content);
            }
        }

        if (! $this->enabled) {
            return;
        }

        $mj = new Client(
            $_ENV['MJ_APIKEY_PUBLIC'],
            $_ENV['MJ_APIKEY_PRIVATE'],
            true,
            [
                'version' => 'v3.1',
            ]
        );

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => 'maherbenrhoumaa@gmail.com',
                        'Name' => 'MS-LEARNING',
                    ],
                    'To' => [
                        [
                            'Email' => $to_email,
                            'Name' => $to_name,
                        ],
                    ],
                    'TemplateID' => 6559638,
                    'TemplateLanguage' => true,
                    'Subjet' => $subject,
                    'Variables' => [
                        'content' => $content,
                    ],
                ],
            ],
        ];

        $mj->post(
            Resources::$Email,
            [
                'body' => $body,
            ]
        );
    }
}
