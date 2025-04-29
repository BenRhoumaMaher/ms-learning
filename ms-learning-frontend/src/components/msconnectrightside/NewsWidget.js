import React from 'react';
import { Link } from 'react-router-dom';
import { getBackgroundStyle, overlayStyle, contentStyle } from '../../helpers/styleHelpers';

const NewsWidget = ({ lesson, course }) => {
    return (
        <div className="">
            <h4 className="widget-title">News</h4>

            {lesson && (
                <div className="rec-events" style={getBackgroundStyle(lesson.course.image)}>
                    <div style={overlayStyle}></div>
                    <div style={contentStyle}>
                        <i className="fa fa-video-camera"></i>
                        <h6>
                            <Link to={`/lessons/${lesson.id}`} className="text-info">
                                <strong className="text-black">{lesson.title}</strong>
                            </Link>
                        </h6>
                        <small style={{ display: 'block', marginBottom: '5px' }}>
                            <strong className="text-info">Starts at: </strong>
                            <strong className="text-success">
                                {new Date(lesson.liveStartTime).toLocaleString()}
                            </strong>
                        </small>
                    </div>
                </div>
            )}

            {course && (
                <div className="rec-events" style={getBackgroundStyle(course.image)}>
                    <div style={overlayStyle}></div>
                    <div style={contentStyle}>
                        <i className="fa fa-graduation-cap"></i>
                        <h6>
                            <Link to={`/courses/${course.id}`}>
                                <strong className="text-black">{course.title}</strong>
                            </Link>
                        </h6>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsWidget;
