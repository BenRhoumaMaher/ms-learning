import React from "react";
import Sidebar from "../../components/admin/Sidebar";

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <h2>Welcome to the Dashboard</h2>
      </div>
    </div>
  );
};

export default Dashboard;
