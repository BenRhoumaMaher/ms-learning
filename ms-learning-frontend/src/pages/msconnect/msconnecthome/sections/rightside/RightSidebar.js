import React from 'react';
import News from './News';
import { useParams } from 'react-router-dom';
import Followers from './Followers';
import Following from './Following';

const RightSidebar = () => {
    const { id } = useParams();
    return (
        <div className="col-lg-3">
            <aside className="sidebar static right">
                <div className="widget">
                    <News />
                </div>
                <div className="widget stick-widget">
                    <Followers currentUserId={id} />
                </div>
                <div className="widget stick-widget">
                    <Following  currentUserId={id} />
                </div>
            </aside>
        </div>
    );
};

export default RightSidebar;
