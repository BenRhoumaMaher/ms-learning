import React from 'react';
import useNews from '../../../../../hooks/useNews';
import NewsWidget from '../../../../../components/msconnectrightside/NewsWidget';

const News = () => {
    const { currentCourse, currentLesson } = useNews();

    return <NewsWidget lesson={currentLesson} course={currentCourse} />;
};

export default News;
