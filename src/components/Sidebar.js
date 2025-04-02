import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUsers, FaUserTie, FaBriefcase } from "react-icons/fa";
import "../assets/css/style.css";

const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ height: "100vh" }}>
      <Sidebar collapsed={collapsed} style={{ height: "100vh", transition: "width 0.3s ease-in-out" }}>
        <Menu>
          {/*logo */}
          <div className="logo">
            <div className="text-center" style={{fontFamily:"FCIconic", fontWeight:"bold", fontSize:"24px"}}>Logo</div>
          </div>
          {/* <MenuItem icon={<FaBars />} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "" : "Toggle"}
          </MenuItem> */}
          <MenuItem icon={<FaHome />} component={<Link to="/console/dashboard" />}>แดชบอร์ด</MenuItem>
          <MenuItem icon={<FaUsers />} component={<Link to="/console/customer" />}>ลูกค้า</MenuItem>
          <MenuItem icon={<FaUserTie />} component={<Link to="/console/employee" />}>พนักงาน</MenuItem>
          <MenuItem icon={<FaBriefcase />} component={<Link to="/console/position" />}>ตำแหน่ง</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
