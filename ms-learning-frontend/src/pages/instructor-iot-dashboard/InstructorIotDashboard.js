import React from "react";
import Sidebar from "./sections/Sidebar";
import '../../styles/styles.css';
import { Outlet } from 'react-router-dom';

const InstructorIotDashboard = () => {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const fullName = user ? `${user.username}`.trim() : 'Instructor';

    return (
        <div className="d-flex" style={{ backgroundColor: "#f8f9fa" }}>
            <Sidebar />

            <div className="flex-grow-1 p-4" style={{ minHeight: "100vh" }}>
                <div
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default InstructorIotDashboard;