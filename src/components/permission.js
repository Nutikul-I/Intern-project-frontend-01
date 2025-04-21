import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';


const Permissions = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        permissions: {
            customer: { view: true, create: false, edit: false, delete: false },
            employee: { view: true, create: false, edit: false, delete: false },
            position: { view: true, create: false, edit: false, delete: false },
        }
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [permissions, setPermissions] = useState([
        {
            id: "0000001",
            name: "พนักงาน",
            permissions: {
                customer: { view: true, create: false, edit: false, delete: false },
                employee: { view: true, create: false, edit: false, delete: false },
                position: { view: true, create: false, edit: false, delete: false },
            }
        }
    ]);


    useEffect(() => {
        getPermissions();
    }, []);

    const getPermissions = async () => {
        const response = await fetch("http://localhost:3000/permission");
        const data = await response.json();
        setPermissions(data);
    };

    const addPermission = async (data) => {
        const response = await fetch("http://localhost:3000/permission", {
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
            setPermissions((prev) => [...prev, result]);
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

    const updatePermission = async (data) => {
        const response = await fetch(`http://localhost:3000/permission/${data.id}`, {
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
            setPermissions((prev) =>
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
    const deletePermissions = async (id) => {
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
                const response = await fetch(`http://localhost:3000/permission/${id}`, {
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
                    setPermissions((prev) => prev.filter((item) => item.id !== id));
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
    const currentItems = permissions.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light">
            <div className="row flex-grow-1">
                {/* Main Content */}
                <div className="col-md-12">
                    <div className="mb-3 bg-white rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">สิทธิ์การใช้งาน</h5>
                            <Button className="btn btn-primary" onClick={handleShow}>เพิ่มข้อมูล</Button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="border-bottom">
                                    <tr>
                                        <th style={{ width: "10%" }}>รหัส</th>
                                        <th style={{ width: "40%" }}>ชื่อสิทธิ์การใช้งาน</th>
                                        <th style={{ width: "40%" }}>รายละเอียด</th>
                                        <th style={{ width: "10%" }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                {Object.entries(item.permissions).map(([key, perms]) => {
                                                    const labelMap = {
                                                        customer: "ลูกค้า",
                                                        employee: "พนักงาน",
                                                        position: "ตำแหน่ง"
                                                    };

                                                    const activePerms = Object.entries(perms)
                                                        .filter(([_, val]) => val)
                                                        .map(([action]) => {
                                                            switch (action) {
                                                                case "view": return "ดู";
                                                                case "create": return "สร้าง";
                                                                case "edit": return "แก้ไข";
                                                                case "delete": return "ลบ";
                                                                default: return action;
                                                            }
                                                        });

                                                    return (
                                                        <div key={key}>
                                                            <strong>{labelMap[key]}:</strong> {activePerms.join(", ")}
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <button className="btn btn-warning me-2 flex-fill 
                                                    d-flex align-items-center justify-content-center p-0"
                                                        style={{ height: "40px" }}
                                                        onClick={() => {
                                                            setFormData({
                                                                id: item.id,
                                                                name: item.name,
                                                                details: item.details,
                                                            });
                                                            console.log(formData);
                                                            handleShow();
                                                        }}>
                                                        <FaEdit style={{ width: "70%", height: "70%" }} />
                                                    </button>
                                                    <button className="btn btn-danger flex-fill d-flex 
                                                    align-items-center justify-content-center p-0"
                                                        style={{ height: "40px" }} onClick={() => deletePermissions(permissions.id)}>
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
                            count={Math.ceil(permissions.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>สิทธิ์ผู้ใช้งาน</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>ชื่อสิทธิ์ผู้ใช้งาน</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="placeholder"
                            />
                        </Form.Group>

                        <Table bordered hover responsive >
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>รายการ</th>
                                    <th>ดู</th>
                                    <th>สร้าง</th>
                                    <th>แก้ไข</th>
                                    <th>ลบ</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {["customer", "employee", "position"].map((item) => (
                                    <tr key={item}>
                                        <td className="text-start">
                                            {{
                                                customer: "ลูกค้า",
                                                employee: "พนักงาน",
                                                position: "ตำแหน่ง",
                                            }[item]}
                                        </td>
                                        {["view", "create", "edit", "delete"].map((action) => (
                                            <td key={action}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={formData.permissions?.[item]?.[action] || false}
                                                    onChange={(e) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            permissions: {
                                                                ...prev.permissions,
                                                                [item]: {
                                                                    ...prev.permissions?.[item],
                                                                    [action]: e.target.checked,
                                                                },
                                                            },
                                                        }));
                                                    }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (formData.id) {
                                updatePermission({ ...formData });
                            } else {
                                addPermission(formData);
                            }
                        }}
                    >
                        {formData.id ? "อัพเดต" : "บันทึก"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default Permissions;