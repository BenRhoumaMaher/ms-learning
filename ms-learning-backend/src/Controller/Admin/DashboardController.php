<?php

/**
 * This file defines the Admin Dashboard controller for the MS-LEARNING application.
 * It configures the admin dashboard, menu items, and handles
 * the default admin route.
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
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Menu\MenuItemInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;

/**
 * Main administration dashboard controller for MS-LEARNING platform.
 * Configures the admin interface including dashboard settings and navigation menu.
 *
 * @category Controllers
 * @package  App\Controller\Admin
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    /**
     * Admin dashboard index action
     *
     * Redirects to the default CRUD controller (User management by default)
     *
     * @return Response Redirect response to the default admin page
     */
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);

        return $this->redirect(
            $adminUrlGenerator
                ->setController(UserCrudController::class)->generateUrl()
        );
    }

    /**
     * Configures the admin dashboard settings
     *
     * @return Dashboard Configured dashboard instance
     */
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('MS-LEARNING');
    }

    /**
     * Configures the admin menu items
     *
     * @return iterable<MenuItemInterface> Collection of menu items
     */
    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Users', 'fas fa-list', User::class);
    }
}
