import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UsefulLinksWidget = () => {
    const { t } = useTranslation();
    const isAuthenticated =
        localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = isAuthenticated
        ? JSON.parse(atob(isAuthenticated.split('.')[1]))
        : null;
    const userId = user?.user_id || null;

    const links = [
        { label: t('explore'), to: '/' },
        { label: t('career'), to: '/become-instructor' },
        { label: t('notifications'), to: '/notifications' },
        { label: t('settings'), to: '/account-settings' },
        { label: t('profile'), to: `/msconnect/profile/${userId}` },
    ];

    return (
        <div className="widget web-links stick-widget">
            <h4 className="widget-title">
                {t("Useful Links")}{' '} <Link to="/" className="see-all">{t("See All")}</Link>
            </h4>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <i className="fa fa-angle-right"></i>{' '}
                        <Link to={link.to} title="">{link.label}</Link>
                    </li>
                ))}
            </ul>
            <p>&copy; MS-LEARNING {new Date().getFullYear()} {t("All Rights Reserved")}.</p>
        </div>
    );
};

export default UsefulLinksWidget;
