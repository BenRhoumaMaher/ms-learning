<?php

namespace App\Form;

use App\Entity\Courses;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname')
            ->add('lastname')
            ->add('email')
            ->add('roles')
            ->add('picture')
            ->add('password')
            ->add('createdAt', null, [
                'widget' => 'single_text',
            ])
            ->add('username')
            ->add('google_id')
            ->add('X')
            ->add('instagram')
            ->add('facebook')
            ->add('linkedin')
            ->add('expertise')
            ->add('resume')
            ->add('courses', EntityType::class, [
                'class' => Courses::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
