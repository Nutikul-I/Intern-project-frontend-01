import React ,{useEffect, useState}from "react";

const Dashboard = () => {

    // mock data
    const dashboardData = [
        {
            title: "Total Users",
            count: 1200,
            growth: "+15%",
            trend: "success",
            icon: "bi bi-person-fill"
        },
        {
            title: "Total Revenue",
            count: 50000,
            growth: "+20%",
            trend: "success",
            icon: "bi bi-currency-dollar"
        },
        {
            title: "Total Orders",
            count: 300,
            growth: "+10%",
            trend: "success",
            icon: "bi bi-basket-fill"
        },
        {
            title: "Total Products",
            count: 150,
            growth: "+5%",
            trend: "success",
            icon: "bi bi-box-fill"
        },
        {
            title: "Total Categories",
            count: 20,
            growth: "+8%",
            trend: "success",
            icon: "bi bi-tags-fill"
        },
        {
            title: "Total Reviews",
            count: 100,
            growth: "+12%",
            trend: "success",
            icon: "bi bi-star-fill"
        }
    ];
    const [data, setData] = useState(dashboardData);

    const getData = async () => {
        await fetch("https://api.example.com/dashboard")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
        };
        fetchData();
    }, []);


    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-12 d-flex flex-column">
                    <main className="flex-grow-1">
                        <div className="row g-4">
                            {data.map((item, index) => (
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
