import React from "react";

const Customer = () => {
    const handleLogout = () => {
        localStorage.removeItem("ez-acc-tk");
        window.location.href = "/login";
    };
    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-md-10 d-flex flex-column">
                    <main className="flex-grow-1 p-3">
                        <h2>Welcome to the Customer Page!</h2>
                        {/*customer content here */}
                    </main>
                </div>
            </div>
        </div>
    );
}
export default Customer;