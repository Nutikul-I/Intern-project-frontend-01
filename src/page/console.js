import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SidebarComponent from "../components/Sidebar";
import { FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import Dashboard from "../components/dashboard";
import Customer from "../components/customer";
import Employee from "../components/employee";
import Position from "../components/position";

const Console = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Handle screen resize to toggle sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change if on small screen
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("ez-acc-tk");
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pageTitles = {
    "/console/dashboard": "แดชบอร์ด",
    "/console/customer": " ",
    "/console/employee": " ",
    "/console/position": " ",
  };
  const headerTitle = pageTitles[location.pathname] || "แดชบอร์ด";

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Navbar for Mobile */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-lg-none">
        <div className="container-fluid">
          <button className="btn btn-outline-secondary" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <span className="fw-bold">{headerTitle}</span>
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle" type="button" onClick={toggleDropdown}>
              <FaUser className="me-2" /> Admin
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> ออกจากระบบ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar bg-light border-end ${sidebarOpen ? "d-block" : "d-none d-lg-block"}`}
        style={{
          width: sidebarOpen ? (window.innerWidth < 1024 ? "100vw" : "250px") : "0px",
          position: "fixed",
          top: "0",
          left: "0",
          minHeight: "100%",
          zIndex: "1050",
          transition: "width 0.3s ease-in-out"
        }}>
        <SidebarComponent currentPath={location.pathname} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen && window.innerWidth >= 1024 ? "250px" : "0",
          transition: "margin-left 0.3s ease-in-out"
        }}>

        {/* Header for Larger Screens */}
        <header className="bg-light p-3 d-none d-lg-flex justify-content-between align-items-center">
          <h1 className="h5 mb-0">{headerTitle}</h1>
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle" type="button" onClick={toggleDropdown}>
              <FaUser className="me-2" /> Admin
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> ออกจากระบบ
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 flex-grow-1 overflow-auto bg-light">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/position" element={<Position />} />
            {/* <Route path="*" element={<Dashboard />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Console;
