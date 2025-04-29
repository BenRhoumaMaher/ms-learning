import React from 'react';
import PopularCoursesWidget from './PopularCoursesWidget';
import RecentBlogsWidget from './RecentBlogsWidget';
import UsefulLinksWidget from './UsefulLinksWidget';

const LeftSidebar = () => {
    return (
        <div className="col-lg-3">
            <aside className="sidebar static left">
                <PopularCoursesWidget />
                <RecentBlogsWidget />
                <UsefulLinksWidget />
            </aside>
        </div>
    );
};

export default LeftSidebar;
