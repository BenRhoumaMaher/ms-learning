<?php

namespace App\Service\GoogleService;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleTokenVerifier
{
    private HttpClientInterface $httpClient;

    public function __construct(
        HttpClientInterface $httpClient
    ) {
        $this->httpClient = $httpClient;
    }

    public function verifyToken(
        string $token
    ): ?array {
        $response = $this->httpClient->request(
            'GET',
            "https://oauth2.googleapis.com/tokeninfo?id_token=" . $token
        );

        if ($response->getStatusCode() !== 200) {
            return null;
        }

        return $response->toArray();
    }
}
