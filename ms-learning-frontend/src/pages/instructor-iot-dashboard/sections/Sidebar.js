import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'

const Sidebar = () => {
    const { id } = useParams();
    const { t } = useTranslation()
    return (
        <div
            className="d-flex flex-column p-3 bg-white"
            style={{ width: "250px", height: "100vh", borderRight: "1px solid #e0e0e0" }}
        >
            <h4 className="text-center mb-4" style={{ color: "#00b4d8" }}>
                <i className="fa fa-graduation-cap me-2"></i>
                <span className="text-dark">{t('Instructor')}</span>
            </h4>

            <ul className="nav nav-pills flex-column">
                {/* Nav Items */}
                <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-tachometer me-2"></i>
                        <span className="text-dark">{t('Overview')}</span>
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/student-management`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-users me-2"></i>
                        <span className="text-dark">{t('Student Management')}</span>
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/engagement-analytics`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-bar-chart me-2"></i>
                        <span className="text-dark">{t('Engagement Analytics')}</span>
                    </Link>
                </li>

                {/* <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/attention`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-heartbeat me-2"></i>
                        <span className="text-dark">Attention Monitoring</span>
                    </Link>
                </li> */}

                <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/feedback`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-comments me-2"></i>
                        <span className="text-dark">{t('Feedback & Sentiment')}</span>
                    </Link>
                </li>

                {/* <li className="nav-item mb-2">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/recommendations`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-lightbulb-o me-2"></i>
                        <span className="text-dark">Recommendations</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/instructor-iot-dashboard/${id}/alerts`}
                        className="nav-link"
                        style={{ color: "#0077b6" }}
                    >
                        <i className="fa fa-bell me-2"></i>
                        <span className="text-dark">Alerts</span>
                    </Link>
                </li> */}
            </ul>
        </div>
    );
};

export default Sidebar;