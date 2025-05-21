<?php

/**
 * This file defines the EditUserCommand DTO (Data Transfer Object),
 * which encapsulates the data required for modifying a user profile.
 * It contains the user identifier, updated profile data, and an optional profile image.
 *
 * @category Commands
 * @package  App\Command\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\User;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Represents the command to edit a user profile in the MS-Learning platform.
 * Contains the user ID, associative array of updated properties,
 * and optional profile image.
 *
 * @category Commands
 * @package  App\Command\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class EditUserCommand
{
    /**
     * Initializes a new instance of EditUserCommand with user update data.
     *
     * @param int               $userId       The ID of the user to be updated
     * @param array             $data         Associative array of updated
     *                                        user properties
     *                                        (e.g., ['firstName' => 'John',
     *                                        'lastName' => 'Doe'])
     * @param UploadedFile|null $profileImage Optional uploaded profile image file
     */
    public function __construct(
        public int $userId,
        public array $data,
        public ?UploadedFile $profileImage = null
    ) {
    }
}
