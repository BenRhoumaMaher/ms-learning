<?php

/**
 * Mail
 *
 * This class handles the sending of emails using the Mailjet API.
 *
 * @category Classes
 * @package  Src\Classe
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/mailjet/mailjet-apiv3-php
 */

namespace Src\Classe;

use Mailjet\Client;
use Mailjet\Resources;

/**
 * Mail
 *
 * Manages email sending functionality.
 *
 * @category Classes
 * @package  Src\Classe
 */
class Mail
{
    /**
     * Sends an email using the Mailjet API.
     *
     * @param string $to_email The recipient's email address.
     * @param string $to_name  The recipient's name.
     * @param string $subject  The subject of the email.
     * @param string $template The email template file name.
     * @param array  $vars     (Optional) Variables to replace in the template.
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

        $mj = new Client(
            $_ENV['MJ_APIKEY_PUBLIC'],
            $_ENV['MJ_APIKEY_PRIVATE'],
            true,
            ['version' => 'v3.1']
        );

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "maherbenrhoumaa@gmail.com",
                        'Name' => "MS-LEARNING",
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

        $mj->post(Resources::$Email, ['body' => $body]);
    }
}
