<?php

/**
 * This file defines the UpdateUserPasswordCommand DTO (Data Transfer Object),
 * which encapsulates the data required for updating a user's password.
 * It contains the user identifier and password update data.
 *
 * @category Commands
 * @package  App\Command\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\User;

/**
 * Represents the command to update a user's password in the MS-Learning platform.
 * Contains the user ID and an array of password-related
 * data including current and new passwords.
 *
 * @category Commands
 * @package  App\Command\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class UpdateUserPasswordCommand
{
    /**
     * @param int $userId The ID of the user whose password will be updated
     * @param array{currentPassword: string, newPassword: string, confirmPassword: string} $data
     *      Associative array containing password information
     */
    public function __construct(
        public int $userId,
        public array $data
    ) {
    }
}
