import React, { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';

const Customer = () => {
    const [show, setShow] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows per page

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
    });

    const [customers, setCustomers] = useState([
        { id: "0000001", name: "นายทดสอบ นามสกุลสมมติ", email: "email@gmail.com" },
    ]);

    useEffect(() => {
        getCustomer();
    }, []);

    const getCustomer = async () => {
        await fetch("https://jsonplaceholder.typicode.com/users").then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok");
            }
        }).then((data) => {
            const customerData = data.map((customer) => ({
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
            }));
            setCustomers(customerData);
        }).catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
    };

    const addCustomer = async () => {
        const newCustomer = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
        };

        await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCustomer),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok");
            }
        }).then((data) => {
            const addedCustomer = {
                name: data.name,
                phone: data.phone,
                email: data.email,
            };
            setCustomers([...customers, addedCustomer]);
            setFormData({
                name: "",
                phone: "",
                email: "",
            });
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ!",
                confirmButtonColor: "#3085d6",
            });
            handleClose();
        }).catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลได้",
                confirmButtonColor: "#d33",
            });
        });
    };

    const updateCustomer = async (id) => {
        const updatedCustomer = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
        };
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCustomer),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok");
            }
        }).then((data) => {
            const updatedCustomerData = {
                id: data.id,
                name: data.name,
                phone: data.phone,
                email: data.email,
            };
            setCustomers(customers.map(customer => (customer.id === id ? updatedCustomerData : customer)));
            setFormData({
                name: "",
                phone: "",
                email: "",
            });
            Swal.fire({
                icon: "success",
                title: "อัปเดตข้อมูลสำเร็จ!",
                confirmButtonColor: "#3085d6",
            });
            handleClose();
        }).catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถอัพเดตข้อมูลได้",
                confirmButtonColor: "#d33",
            });
        });
    };

    const deleteCustomer = async (id) => {
        await Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณต้องการลบข้อมูลนี้หรือไม่!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
                    method: "DELETE",
                }).then(() => {
                    setCustomers(customers.filter(customer => customer.id !== id));
                    Swal.fire({
                        icon: "success",
                        title: "ลบข้อมูลสำเร็จ!",
                        confirmButtonColor: "#3085d6",
                    });
                }).catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลบข้อมูลได้",
                        confirmButtonColor: "#d33",
                    });
                });
            }
        });


    };
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setFormData({
            id: "",
            name: "",
            phone: "",
            email: "",
        });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // pagination logic
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light">
            <div className="row flex-grow-1">
                {/* Main Content */}
                <div className="col-md-12">
                    <div className="mb-3 bg-white rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">ข้อมูลลูกค้า</h5>
                            <Button className="btn btn-primary" onClick={handleShow}>เพิ่มข้อมูล</Button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="border-bottom">
                                    <tr>
                                        <th style={{ width: "10%" }}>รหัส</th>
                                        <th style={{ width: "40%" }}>ชื่อ - นามสกุล</th>
                                        <th style={{ width: "40%" }}>อีเมล</th>
                                        <th style={{ width: "10%" }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <button className="btn btn-warning me-2 flex-fill d-flex align-items-center 
                                                    justify-content-center p-0" style={{ height: "40px" }}
                                                        onClick={() => {
                                                            setFormData({
                                                                id: customer.id,
                                                                name: customer.name,
                                                                phone: customer.phone,
                                                                email: customer.email,
                                                            });
                                                            handleShow();
                                                        }}>
                                                        <FaEdit style={{ width: "70%", height: "70%" }} />
                                                    </button>
                                                    <button className="btn btn-danger flex-fill d-flex align-items-center 
                                                    justify-content-center p-0" style={{ height: "40px" }}
                                                        onClick={() => deleteCustomer(customer.id)}>
                                                        <FaTrash style={{ width: "70%", height: "70%" }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-end mt-3">
                        <Pagination
                            count={Math.ceil(customers.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal */}
            <Modal show={show} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>ลูกค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm={4}>ชื่อ - นามสกุล</Form.Label>
                            <Col sm={8}><Form.Control
                                type="text"
                                name="name"
                                placeholder="กรอกชื่อ"
                                value={formData.name}
                                onChange={handleChange}
                            /></Col>
                        </Form.Group>
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm={4}>เบอร์โทรศัพท์</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    placeholder="กรอกเบอร์โทรศัพท์"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm={4}>อีเมล</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                /></Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button variant="primary" onClick={() => {
                        if (formData.id) {
                            updateCustomer(formData.id);
                        } else {
                            addCustomer();
                        }
                    }}>
                        {formData.id ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Customer;
