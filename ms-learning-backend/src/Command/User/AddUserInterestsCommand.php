<?php

/**
 * This file defines the AddUserInterestsCommand DTO (Data Transfer Object),
 * which encapsulates the data required for adding interest categories to a user.
 * It contains both the user identifier and the category IDs to associate.
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
 * Represents the command to add interest categories to a user profile
 * in the MS-Learning platform. Contains the user ID and an array of
 * category IDs that represent the user's interests.
 *
 * @category Commands
 * @package  App\Command\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class AddUserInterestsCommand
{
    /**
     * Initializes a new instance of AddUserInterestsCommand
     * with user and category data.
     *
     * @param int   $userId      The ID of the user to add interests for
     * @param array $categoryIds Array of category IDs representing user interests
     *                           (e.g., [1, 5, 8] for Technology, Business,
     *                           Science categories)
     */
    public function __construct(
        public int $userId,
        public array $categoryIds
    ) {
    }
}
