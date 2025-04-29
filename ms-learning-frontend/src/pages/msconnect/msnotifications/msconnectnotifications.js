import React from 'react';
import NotificationList from './sections/NotificationList';
const MsconnectNotifications = () => {
    return (
        <div className="">
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <div className="col-lg-12">
                                        <NotificationList />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MsconnectNotifications;
