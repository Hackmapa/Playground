<?php

namespace App\Controller\Admin;

use App\Entity\UserFriendship;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class UserFriendshipCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return UserFriendship::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            BooleanField::new('pending'),
            BooleanField::new('accepted'),
            AssociationField::new('user'),
            AssociationField::new('friend'),
        ];
    }

}
