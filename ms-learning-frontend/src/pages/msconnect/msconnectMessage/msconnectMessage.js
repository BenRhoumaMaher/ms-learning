import React from 'react';
import '../../../styles/msconnectmessagestyle.css';
import MessageBox from './sections/MessageBox';
import UserProfileSidebar from './sections/UserProfileSidebar';
import { MessageProvider } from './context/MessageContext';

const MsconnectMessage = () => {
    return (
        <div className="theme-layout">
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <MessageProvider>
                                        <div className="row">
                                            <MessageBox />
                                            <UserProfileSidebar />
                                        </div>
                                    </MessageProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MsconnectMessage;