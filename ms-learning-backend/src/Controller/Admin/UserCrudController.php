<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Users')
            ->setEntityLabelInPlural('Users');
    }

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
