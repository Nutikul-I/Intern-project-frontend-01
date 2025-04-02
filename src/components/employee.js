import React from "react";

const Employee = () => {
    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-md-10 d-flex flex-column">
                    <main className="flex-grow-1 p-3">
                        <h2>Welcome to the Employee Page!</h2>
                        {/*employee content here */}
                    </main>
                </div>
            </div>
        </div>
    );
}
export default Employee;