import React from 'react';
import { useParams } from 'react-router-dom';
import '../../../styles/msconnectprofile.css';
import '../../../styles/plugins.min.css';
import UserProfileHeader from './reused/UserProfileHeader';
import UserProfileSidebar from './reused/UserProfileSidebar';
import { Outlet } from 'react-router-dom';
import Footer from '../../../layouts/Footer';

const UserProfilePage = () => {
    const { id } = useParams();
    return (
        <div>
            <UserProfileHeader userId={id} />
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <Outlet userId={id} />
                    </div>
                    <div className="col-md-4">
                        <UserProfileSidebar userId={id} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfilePage;
