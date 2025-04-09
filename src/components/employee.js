import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';
import { readFile } from '@ramonak/react-excel';
import * as XLSX from 'xlsx';


const Employee = ({ size = 80 }) => {
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [imageSrc, setImageSrc] = useState("");
    const [imgError, setImgError] = useState(false);
    const fileInputRef = useRef(null);
    const [employees, setEmployees] = useState([
        { id: "0000001", name: "นายทดสอบ นามสกุลสมมติ", position: "ตำแหน่ง", email: "email@gmail.com" },
    ]);

    const [formData, setFormData] = useState({
        id: "",
        prefix: "",
        firstName: "",
        lastName: "",
        position: "",
        color: "",
        email: "",
        password: "",
        status: "active",
        salary: "",
        dayPay: "",
        socialSecurity: "yes",
        socialNumber: "",
        withholdingTax: "",
        seatRate: "",
        otRate: "",
        paymentChannels: "",
        accountType: "saving",
        bank: "",
        accountNumber: "",
        bankBranch: "",
        leave: 0,
        vacationLeave: 0,
        sickLeave: 0,
        allPermissions: false,
        customer: false,
        employee: false,
        positionSeting: false,
    });

    useEffect(() => {
        getEmployee();
    }, []);

    const getEmployee = async () => {
        const response = await fetch("http://localhost:3000/employee");
        const data = await response.json();
        setEmployees(data);
    };

    const addEmployee = async (employee) => {
        const response = await fetch("http://localhost:3000/employee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        });
        if (response.ok) {
            const newEmployee = await response.json();
            setEmployees((prev) => [...prev, newEmployee]);
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ!",
                confirmButtonColor: "#3085d6",
            });
            handleClose();
        } else {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลได้",
                confirmButtonColor: "#d33",
            });
        }
    };

    const updateEmployee = async (employee) => {
        const response = await fetch(`http://localhost:3000/employee/${employee.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        });
        if (response.ok) {
            const updatedEmployee = await response.json();
            setEmployees((prev) =>
                prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
            Swal.fire({
                icon: "success",
                title: "อัพเดตข้อมูลพนักงานสำเร็จ!",
                confirmButtonColor: "#3085d6",
            });
            handleClose();
        } else {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                text: "ไม่สามารถบันทึกข้อมูลได้",
                confirmButtonColor: "#d33",
            });
        }
    };
    const deleteEmployee = async (id) => {
        await Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณต้องการลบข้อมูลนี้หรือไม่!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            const response = await fetch(`http://localhost:3000/employee/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                setEmployees((prev) => prev.filter((employee) => employee.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "อัพเดตข้อมูลพนักงานสำเร็จ!",
                    confirmButtonColor: "#3085d6",
                });
                handleClose();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาดในการลบข้อมูล",
                    text: "ไม่สามารถบันทึกข้อมูลได้",
                    confirmButtonColor: "#d33",
                });
            }
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        readFile(file)
            .then((readedData) => {
                // Assuming the sheet contains the correct columns for the employees (id, name, position, email, etc.)
                const formattedData = readedData.Sheets[readedData.SheetNames[0]];  // Get the first sheet

                const employeesData = [];
                for (let rowIndex = 2; rowIndex <= formattedData['!ref'].split(':')[1].replace(/[A-Z]/g, ''); rowIndex++) {
                    const row = formattedData[`A${rowIndex}`];
                    if (row && row.v) {
                        const rowData = {
                            id: formattedData[`A${rowIndex}`]?.v,
                            name: formattedData[`B${rowIndex}`]?.v + ' ' + formattedData[`C${rowIndex}`]?.v,
                            position: formattedData[`E${rowIndex}`]?.v,
                            email: "nal",
                        };
                        employeesData.push(rowData);
                    }
                }

                // Update the employees state with the new data
                setEmployees(employeesData);
            })
            .catch((error) => console.error("Error reading file:", error));
    };

    const handleExport = () => {
        // Convert employees data (JSON) to a sheet
        const ws = XLSX.utils.json_to_sheet(employees);

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Append the sheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Employees");

        // Generate the Excel file and trigger the download
        XLSX.writeFile(wb, "employees.xlsx");
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // pagination logic
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
            setImgError(false); // reset error in case of new image
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setFormData({
            id: "",
            prefix: "",
            firstName: "",
            lastName: "",
            position: "",
            color: "",
            email: "",
            password: "",
            status: "active",
            salary: "",
            dayPay: "",
            socialSecurity: "yes",
            socialNumber: "",
            withholdingTax: "",
            seatRate: "",
            otRate: "",
            paymentChannels: "",
            accountType: "saving",
            bank: "",
            accountNumber: "",
            bankBranch: "",
            leave: 0,
            vacationLeave: 0,
            sickLeave: 0,
        });
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light">
            <div className="row flex-grow-1">
                {/* Main Content */}
                <div className="col-md-12">
                    <div className="mb-3 bg-white rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold">ข้อมูลพนักงาน</h5>
                            <div className="d-flex gap-2">
                                <Button className="btn btn-primary" onClick={handleShow}>เพิ่มข้อมูล</Button>
                                {/* File Upload Button */}
                                <label className="btn btn-info">
                                    <input
                                        type="file"
                                        accept=".xlsx,.csv"
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                    />
                                    Upload File
                                </label>
                                <Button className="btn btn-success" onClick={handleExport}>Export</Button>
                            </div>

                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="border-bottom">
                                    <tr>
                                        <th style={{ width: "10%" }}>รหัส</th>
                                        <th style={{ width: "30%" }}>ชื่อ - นามสกุล</th>
                                        <th style={{ width: "25%" }}>ตำแหน่ง</th>
                                        <th style={{ width: "25%" }}>อีเมล</th>
                                        <th style={{ width: "10%" }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.position}</td>
                                            <td>{employee.email}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <button className="btn btn-warning me-2 
                                                    flex-fill d-flex align-items-center 
                                                    justify-content-center p-0"
                                                        style={{ height: "40px" }} onClick={() => {
                                                            const [firstName, lastName] = (employee.name || "").split(" ");
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ...employee,
                                                                firstName: firstName || "",
                                                                lastName: lastName || ""
                                                            }));
                                                            setImageSrc(employee.imageSrc || "");
                                                            setImgError(false);
                                                            handleShow();
                                                        }}>
                                                        <FaEdit style={{ width: "70%", height: "70%" }} />
                                                    </button>
                                                    <button className="btn btn-danger flex-fill 
                                                    d-flex align-items-center justify-content-center p-0"
                                                        style={{ height: "40px" }} onClick={() => deleteEmployee(employee.id)}>
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
                            count={Math.ceil(employees.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#6edff6" }}>
                        {formData.id ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงาน"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <h5 style={{ color: "#6edff6" }}>ข้อมูลพนักงาน</h5>
                                <div className="text-center mb-3" style={{ cursor: "pointer" }} onClick={handleImageClick}>
                                    {imgError || !imageSrc ? (
                                        <FaUserCircle size={size} color="#ccc" />
                                    ) : (
                                        <img
                                            src={imageSrc}
                                            alt="avatar"
                                            className="rounded-circle"
                                            width={size}
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>คำนำหน้า</Form.Label>
                                    <Col sm={8}><Form.Control
                                        name="prefix"
                                        value={formData.prefix}
                                        onChange={handleChange}
                                        placeholder="กรอกคำนำหน้า" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ชื่อ</Form.Label>
                                    <Col sm={8}><Form.Control
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="กรอกชื่อ" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>นามสกุล</Form.Label>
                                    <Col sm={8}><Form.Control
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="กรอกนามสกุล" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ตำแหน่ง</Form.Label>
                                    <Col sm={8}><Form.Select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}>
                                        <option value="">เลือกตำแหน่ง</option>
                                        <option value="manager">ผู้จัดการ</option>
                                        <option value="staff">พนักงาน</option>
                                    </Form.Select></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>สี</Form.Label>
                                    <Col sm={8}><Form.Select name="color" value={formData.color} onChange={handleChange}>
                                        <option value="">เลือกสี</option>
                                        <option value="red">แดง</option>
                                        <option value="blue">น้ำเงิน</option>
                                    </Form.Select></Col>
                                </Form.Group>
                                <h5 style={{ color: "#6edff6" }}>บัญชีผู้ใช้งาน</h5>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>อีเมล</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@gmail.com" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>รหัสผ่าน</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="**********" /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>สถานะ</Form.Label>
                                    <Col sm={8}>
                                        <div>
                                            <Form.Check inline type="radio" label="ใช้งาน"
                                                name="status" value="active" checked={formData.status === "active"}
                                                onChange={handleChange} />
                                            <Form.Check inline type="radio" label="พักใช้งาน"
                                                name="status" value="inactive" checked={formData.status === "inactive"}
                                                onChange={handleChange} />
                                        </div></Col>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <h5 style={{ color: "#6edff6" }}>ข้อมูลเงินเดือน/ค่าจ้าง</h5>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>เงินเดือน</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            placeholder="กรอกเงินเดือน" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>วันที่จ่าย</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="dayPay"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            placeholder="เลือกวันที่จ่ายเงินเดือน" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ประกันสังคม</Form.Label>
                                    <Col sm={8}>
                                        <div>
                                            <Form.Check inline type="radio"
                                                label="มี" name="socialSecurity"
                                                value="yes" checked={formData.socialSecurity === "yes"}
                                                onChange={handleChange} />
                                            <Form.Check inline type="radio"
                                                abel="ไม่มี" name="socialSecurity"
                                                value="no" checked={formData.socialSecurity === "no"}
                                                onChange={handleChange} />
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>เลขประกันสังคม</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="socialNumber"
                                            value={formData.socialNumber}
                                            onChange={handleChange}
                                            placeholder="เลขประกันสังคม" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>หัก ณ ที่จ่าย</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="withholdingTax"
                                            value={formData.withholdingTax}
                                            onChange={handleChange}
                                            placeholder="กรอกหัก ณ ที่จ่าย" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ค่านั่ง/ชั่วโมง</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="seatRate"
                                            value={formData.seatRate}
                                            onChange={handleChange}
                                            placeholder="กรอกค่านั่ง/ชั่วโมง" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ค่าโอที</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="otRate"
                                            value={formData.otRate}
                                            onChange={handleChange}
                                            placeholder="ค่าล่วงเวลา/ชั่วโมง" />
                                    </Col>
                                </Form.Group>

                                <h5 style={{ color: "#6edff6" }}>ข้อมูลบัญชีธนาคาร</h5>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ช่องทางการชำระ</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="paymentChannels"
                                            value={formData.paymentChannels}
                                            onChange={handleChange}
                                            placeholder="เลือกช่องทางการชำระ" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ประเภทบัญชี</Form.Label>
                                    <Col sm={8}>
                                        <div>
                                            <Form.Check inline type="radio"
                                                label="ออมทรัพย์" name="accountType"
                                                value="saving" checked={formData.accountType === "saving"}
                                                onChange={handleChange} />
                                            <Form.Check inline type="radio"
                                                label="กระแสรายวัน" name="accountType"
                                                value="current" checked={formData.accountType === "current"}
                                                onChange={handleChange} />
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ธนาคาร</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="bank"
                                            value={formData.bank}
                                            onChange={handleChange}
                                            placeholder="กรอกธนาคาร" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>เลขบัญชี</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            placeholder="กรอกชื่อบัญชี" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>สาขาธนาคาร</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="bankBranch"
                                            value={formData.bankBranch}
                                            onChange={handleChange}
                                            placeholder="กรอกชื่อบัญชี" />
                                    </Col>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <h5 style={{ color: "#6edff6" }}>จำนวนวันหยุดประจำปี</h5>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ลากิจ</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="leave"
                                            value={formData.leave}
                                            onChange={handleChange}
                                            placeholder="ลากิจ" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ลาพักร้อน</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="vacationLeave"
                                            value={formData.vacationLeave}
                                            onChange={handleChange}
                                            placeholder="ลาพักร้อน" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>ลาป่วย</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control name="sickLeave"
                                            value={formData.sickLeave}
                                            onChange={handleChange}
                                            placeholder="ลาป่วย" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}><h5 style={{ color: "#6edff6" }}>สิทธิ์การใช้งาน</h5></Form.Label>
                                    <Col sm={8}>
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            label="เลือกทั้งหมด"
                                            name="allPermissions"
                                            checked={formData.allPermissions}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    allPermissions: checked,
                                                    customer: checked,
                                                    employee: checked,
                                                    positionSeting: checked
                                                }));
                                            }}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label>ข้อมูลผุ้ใช้</Form.Label>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="ลูกค้า"
                                            name="customer"
                                            checked={formData.customer}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="พนักงาน"
                                            name="employee"
                                            checked={formData.employee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label >ตั้งค่า</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="ตำแหน่ง"
                                        name="positionSeting"
                                        checked={formData.positionSeting}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center gap-3">
                    <Button
                        variant="outline-info"
                        onClick={handleClose}
                        style={{
                            borderRadius: '20px',
                            padding: '10px 30px',
                            minWidth: '120px',
                            fontWeight: 'bold'
                        }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        style={{
                            background: '#6edff6',
                            borderRadius: '20px',
                            border: 'none',
                            padding: '10px 30px',
                            minWidth: '120px',
                            fontWeight: 'bold'
                        }}
                        onClick={() => {
                            formData.id ? updateEmployee(formData) : addEmployee(formData);
                        }}
                    >
                        ยืนยัน
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Employee;
