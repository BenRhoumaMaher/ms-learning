import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const Users = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="add" element={<h2>Add User Page (To be implemented)</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default Users;
