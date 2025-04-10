import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaUserTie, FaBriefcase } from "react-icons/fa";
import "../assets/css/style.css";
import logo from "../assets/image/JmLogo.png";


const AppSidebar = ({ currentPath }) => {

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "10px",
          width: "250px",
        }}
      >
        <div className="logo" style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "60px", height: "60px" }}
          />
        </div>

        <Menu>
          <MenuItem
            active={currentPath === "/console/dashboard"}
            icon={<FaHome style={{
              color: currentPath === "/console/dashboard" ? "#ffffff" : "#6edff6",
              backgroundColor: currentPath === "/console/dashboard" ? "#6edff6" : "#ffffff",
              borderRadius: "50%", padding: "5px", fontSize: "24px"
            }} />}
            component={<Link to="/console/dashboard" />}
            style={{
              backgroundColor: currentPath === "/console/dashboard" ? "#ffffff" : "transparent",
              boxShadow: currentPath === "/console/dashboard" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
              color: currentPath === "/console/dashboard" ? "#333" : "#999",
              borderRadius: "10px",
              marginBottom: "10px",
              padding: "12px",
            }}
          >
            แดชบอร์ด
          </MenuItem>

          <div style={{ padding: "10px 15px", fontWeight: "bold", color: "#333" }}>ข้อมูลผู้ใช้</div>
          <MenuItem
            active={currentPath === "/console/customer"}
            icon={<FaUsers style={{
              color: currentPath === "/console/customer" ? "#ffffff" : "#6edff6",
              backgroundColor: currentPath === "/console/customer" ? "#6edff6" : "#ffffff",
              borderRadius: "50%", padding: "5px", fontSize: "24px"
            }} />}
            component={<Link to="/console/customer" />}
            style={{
              backgroundColor: currentPath === "/console/customer" ? "#ffffff" : "transparent",
              boxShadow: currentPath === "/console/customer" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
              color: currentPath === "/console/customer" ? "#333" : "#999",
              borderRadius: "10px",
              marginBottom: "10px",
              padding: "12px",
            }}
          >
            ลูกค้า
          </MenuItem>

          <MenuItem
            active={currentPath === "/console/employee"}
            icon={<FaUserTie style={{
              color: currentPath === "/console/employee" ? "#ffffff" : "#6edff6",
              backgroundColor: currentPath === "/console/employee" ? "#6edff6" : "#ffffff",
              borderRadius: "50%", padding: "5px", fontSize: "24px"
            }} />}
            component={<Link to="/console/employee" />}
            style={{
              backgroundColor: currentPath === "/console/employee" ? "#ffffff" : "transparent",
              boxShadow: currentPath === "/console/employee" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
              color: currentPath === "/console/employee" ? "#333" : "#999",
              borderRadius: "10px",
              marginBottom: "10px",
              padding: "12px",
            }}
          >
            พนักงาน
          </MenuItem>

          <div style={{ padding: "10px 15px", fontWeight: "bold", color: "#333", marginTop: "15px" }}>ตั้งค่าระบบ</div>
          <MenuItem
            active={currentPath === "/console/position"}
            icon={<FaBriefcase style={{
              color: currentPath === "/console/position" ? "#ffffff" : "#6edff6",
              backgroundColor: currentPath === "/console/position" ? "#6edff6" : "#ffffff",
              borderRadius: "50%", padding: "5px", fontSize: "24px"
            }} />}
            component={<Link to="/console/position" />}
            style={{
              backgroundColor: currentPath === "/console/position" ? "#ffffff" : "transparent",
              boxShadow: currentPath === "/console/position" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
              color: currentPath === "/console/position" ? "#333" : "#999",
              borderRadius: "10px",
              marginBottom: "10px",
              padding: "12px",
            }}
          >
            ตำแหน่ง
          </MenuItem>
        </Menu>

        <div style={{ position: "absolute", bottom: "20px", textAlign: "center", width: "100%", color: "#999" }}>
          version 1.0.0
        </div>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
