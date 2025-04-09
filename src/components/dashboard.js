import React from "react";

// Mock data for the dashboard
const dashboardData = [
    {
        title: "ลูกค้า (คน)",
        count: 53000,
        growth: "+55%",
        icon: "bi bi-bell",
        trend: "success",
    },
    {
        title: "พนักงาน (คน)",
        count: 1200,
        growth: "+12%",
        icon: "bi bi-bell",
        trend: "success",
    },
    {
        title: "ตำแหน่ง",
        count: 25,
        growth: "+8%",
        icon: "bi bi-bell",
        trend: "success",
    },
];

const Dashboard = () => {
    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-12 d-flex flex-column">
                    <main className="flex-grow-1">
                        <div className="row g-4">
                            {dashboardData.map((item, index) => (
                                <div key={index} className="col-12 col-sm-6 col-md-4">
                                    <div className="card shadow-sm p-4 h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted">{item.title}</h6>
                                                <h4 className="fw-bold">{item.count.toLocaleString()}</h4>
                                                <span className={`text-${item.trend}`}>{item.growth}</span>
                                            </div>
                                            <div
                                                className="bg-primary p-3 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "50px", height: "50px" }}
                                            >
                                                <i className={`${item.icon} fs-4 text-white`}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
