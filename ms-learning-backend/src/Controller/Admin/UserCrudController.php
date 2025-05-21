<?php

/**
 * This file defines the User CRUD controller for the admin interface
 * of MS-LEARNING application. It handles user management operations
 * including listing, creating, editing, and deleting users.
 *
 * @category Controllers
 * @package  App\Controller\Admin
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

/**
 * CRUD controller for managing User entities in the admin panel.
 * Configures the user management interface including fields display,
 * labels, and role selection.
 *
 * @category Controllers
 * @package  App\Controller\Admin
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class UserCrudController extends AbstractCrudController
{
    /**
     * Returns the fully qualified entity class name
     *
     * @return string The User entity class name
     */
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    /**
     * Configures the CRUD settings for User management
     *
     * @param Crud $crud The CRUD configuration object
     *
     * @return Crud Configured CRUD instance
     */
    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Users')
            ->setEntityLabelInPlural('Users');
    }

    /**
     * Configures the fields to be displayed in the User CRUD interface
     *
     * @param string $pageName The current page (index, detail, new, edit)
     *
     * @return iterable<FieldInterface> Collection of field configurations
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('firstname')->setLabel('First Name'),
            TextField::new('lastname')->setLabel('Last Name'),
            TextField::new('username')->setLabel('UserName'),
            ChoiceField::new('roles')
                ->setLabel('Permissions')
                ->setHelp('Permissions of the user')
                ->setChoices(
                    [
                        'ROLE_STUDENT' => 'ROLE_STUDENT',
                        'ROLE_TEACHER' => 'ROLE_INSTRUCTOR',
                        'ROLE_ADMIN' => 'ROLE_ADMIN',
                    ]
                )
                ->allowMultipleChoices(),
            TextField::new('email')->setLabel('Email')->onlyOnIndex(),
        ];
    }
}
