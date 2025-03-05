<?php

namespace Src\Classe;

use Mailjet\Client;
use Mailjet\Resources;

class Mail
{
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
