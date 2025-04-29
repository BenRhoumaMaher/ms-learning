import React, { useState } from 'react';
import '../../../styles/msconnecthomestyle.css';
import LeftSidebar from './sections/leftside/LeftSidebar';
import CenterContent from './sections/CenterContent/CenterContent';
import CreatePostBox from './sections/CenterContent/CreatePostBox';
import SuggestedPeopleBox from './sections/CenterContent/SuggestedPeopleBox';
import RightSidebar from './sections/rightside/RightSidebar';
import ImageWithCommentsModal from './sections/modals/ImageWithCommentsModal';
import PostList from './sections/CenterContent/Postlist';
import { useParams } from 'react-router-dom';



const MsConnectHome = () => {
    const { id } = useParams();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    return (
        <section>
            <div className="gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div id="page-contents" className="row">
                                <LeftSidebar className="left-sidebar" />
                                <CenterContent className="center-content" >
                                    <div className="main-wraper">
                                        <CreatePostBox />
                                    </div>
                                    <div className="main-wraper">
                                        <SuggestedPeopleBox currentUserId={id} />
                                    </div>
                                    <div className="main-wraper">
                                        <PostList 
                                            onTriggerImageModal={() => setIsImageModalOpen(true)} />
                                    </div>
                                </CenterContent>
                                <RightSidebar className="right-sidebar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImageWithCommentsModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
        </section>
    );
};

export default MsConnectHome;
