<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use League\OAuth2\Client\Provider\GoogleUser;

final readonly class OAuthRegistrationService
{
    public function persist(
        GoogleUser $resourceOwner,
        UserRepository $repository
    ): User {
        $email = $resourceOwner->getEmail();
        $username = explode('@', $email)[0];
        $password = bin2hex(random_bytes(8));
        $user = (new User())
            ->setEmail($email)
            ->setGoogleId($resourceOwner->getId())
            ->setFirstname($username)
            ->setLastname($username)
            ->setPicture('/profile/avatar.png')
            ->setPassword($password);

        $repository->add($user, true);
        return $user;
    }
}
