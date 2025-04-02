import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SidebarComponent from "../components/Sidebar";
import { FaUser, FaCog, FaStickyNote, FaSignOutAlt } from "react-icons/fa"; // Import icons

import Dashboard from "../components/dashboard";
import Customer from "../components/customer";
import Employee from "../components/employee";
import Position from "../components/position";

const Console = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle dropdown

  const handleLogout = () => {
    localStorage.removeItem("ez-acc-tk");
    window.location.href = "/login";
  };

  // Get current location to update header dynamically
  const location = useLocation();

  // Map paths to titles
  const pageTitles = {
    "/console/dashboard": "แดชบอร์ด",
    "/console/customer": "ลูกค้า",
    "/console/employee": "พนักงาน",
    "/console/position": "ตำแหน่ง",
  };

  // Get the title based on the current path, default to "Console"
  const headerTitle = pageTitles[location.pathname] || "Console";

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Sidebar */}
      <div className="bg-light border-right d-flex flex-column" style={{ width: "250px", minWidth: "250px" }}>
        <SidebarComponent />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <h1 className="h5">{headerTitle}</h1> {/* Dynamic Title */}
          
          {/* Profile Dropdown */}
          <div className="position-relative">
            <button 
              className="btn btn-light d-flex align-items-center" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUser size={20} className="me-2" />
              <span>Username</span>
            </button>

            {dropdownOpen && (
              <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2">
                <button className="dropdown-item d-flex align-items-center text-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </div>
            )}
          </div>

        </header>

        {/* Main Content */}
        <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customer" element={<Customer />} />
            <Route path="employee" element={<Employee />} />
            <Route path="position" element={<Position />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Console;
