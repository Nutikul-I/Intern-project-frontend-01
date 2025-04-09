import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';


const Position = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        position: "",
        salary: "",
        active: false,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [position, setPosition] = useState([
        { id: "0000001", position: "ตำแหน่ง", salary: "20000" },
    ]);

    useEffect(() => {
        getPosition();
    }, []);

    const getPosition = async () => {
        const response = await fetch("http://localhost:3000/posistion");
        const data = await response.json();
        setPosition(data);
    };

    const addPosition = async (data) => {
        const response = await fetch("http://localhost:3000/position", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ",
                text: "บันทึกข้อมูลตำแหน่งเรียบร้อยแล้ว",
            });
            setPosition((prev) => [...prev, result]);
            setFormData({
                name: "",
                salary: "",
                active: false,
            });
            handleClose();
        } else {
            Swal.fire({
                icon: "error",
                title: "บันทึกข้อมูลไม่สำเร็จ",
                text: result.message,
            });
        }
    };

    const updatePosition = async (data) => {
        const response = await fetch(`http://localhost:3000/position/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "อัพเดตข้อมูลสำเร็จ",
                text: "อัพเดตข้อมูลตำแหน่งเรียบร้อยแล้ว",
            });
            setPosition((prev) =>
                prev.map((item) => (item.id === data.id ? result : item))
            );
            setFormData({
                name: "",
                salary: "",
                active: false,
            });
            handleClose();
        } else {
            Swal.fire({
                icon: "error",
                title: "อัพเดตข้อมูลไม่สำเร็จ",
                text: result.message,
            });
        }
    };
    const deletePosition = async (id) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:3000/position/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "ลบข้อมูลสำเร็จ",
                        text: "ลบข้อมูลตำแหน่งเรียบร้อยแล้ว",
                    });
                    setPosition((prev) => prev.filter((item) => item.id !== id));
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "ลบข้อมูลไม่สำเร็จ",
                        text: "ไม่สามารถลบข้อมูลตำแหน่งได้",
                    });
                }
            }
        });
    };

    const handleToggle = (e) => {
        setFormData({ ...formData, active: e.target.checked });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // pagination logic
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = position.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light">
            <div className="row flex-grow-1">
                {/* Main Content */}
                <div className="col-md-12">
                    <div className="mb-3 bg-white rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">ตำแหน่ง</h5>
                            <Button className="btn btn-primary" onClick={handleShow}>เพิ่มข้อมูล</Button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="border-bottom">
                                    <tr>
                                        <th style={{ width: "10%" }}>รหัส</th>
                                        <th style={{ width: "40%" }}>ชื่อตำแหน่ง</th>
                                        <th style={{ width: "40%" }}>เงินเดือน</th>
                                        <th style={{ width: "10%" }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.position}</td>
                                            <td>{item.salary}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <button className="btn btn-warning me-2 flex-fill 
                                                    d-flex align-items-center justify-content-center p-0"
                                                        style={{ height: "40px" }}
                                                        onClick={() => {
                                                            setFormData({
                                                                id: item.id,
                                                                position: item.position,
                                                                salary: item.salary,
                                                                active: item.active || false,
                                                            });
                                                            console.log(formData);
                                                            handleShow();
                                                        }}>
                                                        <FaEdit style={{ width: "70%", height: "70%" }} />
                                                    </button>
                                                    <button className="btn btn-danger flex-fill d-flex 
                                                    align-items-center justify-content-center p-0"
                                                        style={{ height: "40px" }} onClick={() => deletePosition(position)}>
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
                            count={Math.ceil(position.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>ตำแหน่ง</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-end">
                                <Form.Label>ชื่อตำแหน่ง</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="position"
                                    placeholder="placeholder"
                                    value={formData.position}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-end">
                                <Form.Label>เงินเดือน</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control
                                    type="number"
                                    name="salary"
                                    placeholder="placeholder"
                                    value={formData.salary}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3 align-items-center">
                            <Col sm={3} className="text-end">
                                <Form.Label>ใช้งาน</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label=""
                                    checked={formData.active}
                                    onChange={handleToggle}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button variant="primary" onClick={() => {
                        if (formData.id) {
                            updatePosition({ ...formData, id: formData.id });
                        } else {
                            addPosition(formData);
                        }
                        }
                    }>
                        {formData.id ? "อัพเดต" : "บันทึก"}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
export default Position;