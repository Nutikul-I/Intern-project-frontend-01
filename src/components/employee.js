import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';
import { readFile } from '@ramonak/react-excel';
import * as XLSX from 'xlsx';
import { pdf, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import THSarabun from '../assets/font/THSarabunNew.ttf';
import THSarabunBold from '../assets/font/THSarabunNew Bold.ttf';
import signatureImg from '../assets/image/signature2.webp';

Font.register({
    family: 'THSarabun',
    fonts: [
        { src: THSarabun, fontWeight: 'normal' },
        { src: THSarabunBold, fontWeight: 'bold' },
    ],
});


const Employee = ({ size = 80 }) => {
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [imageSrc, setImageSrc] = useState("");
    const [imgError, setImgError] = useState(false);
    const fileInputRef = useRef(null);
    const [employees, setEmployees] = useState([
        {
            id: "0000001", firstName: "นายทดสอบ", lastName: "นามสกุลสมมติ",
            sex: "ชาย", position: "ตำแหน่ง", Department: "แผนก", email: "email@gmail.com",
            startDate: "2023-01-01", salary: "10000"
        },
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
                const sheet = readedData.Sheets[readedData.SheetNames[0]];
                const range = sheet["!ref"];
                const endRow = parseInt(range.split(":")[1].replace(/[A-Z]/g, ''));

                const employeesData = [];
                for (let rowIndex = 2; rowIndex <= endRow; rowIndex++) {
                    const id = sheet[`A${rowIndex}`]?.v;
                    const firstName = sheet[`B${rowIndex}`]?.v;
                    const lastName = sheet[`C${rowIndex}`]?.v;
                    const sex = sheet[`D${rowIndex}`]?.v;
                    const position = sheet[`E${rowIndex}`]?.v;
                    const department = sheet[`F${rowIndex}`]?.v;
                    const startDate = sheet[`G${rowIndex}`]?.v;
                    const salary = sheet[`H${rowIndex}`]?.v;

                    if (id) {
                        employeesData.push({
                            id,
                            firstName,
                            lastName,
                            sex,
                            position,
                            Department: department,
                            email: "-", // No email in Excel, use placeholder or generate if needed
                            startDate: convertExcelDate(startDate),
                            salary: salary.toString()
                        });
                    }
                }

                setEmployees(employeesData);
            })
            .catch((error) => console.error("Error reading file:", error));
    };

    const convertExcelDate = (excelDate) => {
        if (typeof excelDate === "number") {
            const date = new Date((excelDate - 25569) * 86400 * 1000);
            return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        }
        return excelDate; // Already a valid date string
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


    const styles = StyleSheet.create({
        table: {
            marginTop: 10,
            width: '100%',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCell: {
            flex: 1,
            padding: 4,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            textAlign: 'center',
        },
    });

    const handleExportPDF = () => {
        const maleCount = employees.filter(emp => emp.sex === 'ชาย').length;
        const femaleCount = employees.filter(emp => emp.sex === 'หญิง').length;

        const employeeTableHeader = ['รหัสพนักงาน', 'ชื่อ', 'นามสกุล', 'เพศ', 'ตำแหน่ง', 'แผนก', 'วันที่เริ่มงาน', 'เงินเดือน'];

        const employeeTableBody = employees.slice(0, 15).map(emp => (
            <View key={emp.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{emp.id}</Text>
                <Text style={styles.tableCell}>{emp.firstName}</Text>
                <Text style={styles.tableCell}>{emp.lastName}</Text>
                <Text style={styles.tableCell}>{emp.sex}</Text>
                <Text style={styles.tableCell}>{emp.position}</Text>
                <Text style={styles.tableCell}>{emp.Department}</Text>
                <Text style={styles.tableCell}>{emp.startDate}</Text>
                <Text style={styles.tableCell}>{emp.salary}</Text>
            </View>
        ));

        const doc = (
            <Document>
                <Page size="A4" style={{ padding: 40, fontFamily: 'THSarabun', fontSize: 14 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            textAlign: 'center',
                            fontFamily: 'THSarabun',
                            marginBottom: 10,
                        }}
                        render={({ pageNumber }) => `${pageNumber}`}
                        fixed
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>ข้อมูลพนักงาน</Text>
                        <Text style={{ fontSize: 14 }}>วันที่: 9 เดือนเมษายน 2568</Text>
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, { backgroundColor: '#eee' }]}>
                            {employeeTableHeader.map((header, index) => (
                                <Text key={index} style={[styles.tableCell, { fontWeight: 'bold' }]}>
                                    {header}
                                </Text>
                            ))}
                        </View>
                        {employeeTableBody}
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text>รวมพนักงานทั้งหมด {employees.length} คน</Text>
                        <Text>แบ่งเป็น ชาย {maleCount} คน หญิง {femaleCount} คน</Text>
                    </View>

                    <View style={{ marginTop: 20, alignItems: 'flex-end', paddingRight: 40 }}>
                        <Text>ลงชื่อ...........................................</Text>
                        <Text>(..............................................)</Text>
                        <Text>ตำแหน่ง:......ผู้บันทึกข้อมูล......</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', paddingRight: 40 }} >
                        <Text style={{ fontSize: 14, fontFamily: 'THSarabun', marginBottom: 5 }}>
                            ลายเซ็น
                        </Text>
                        <View
                            style={{
                                border: '2px solid #1a2b34',
                                padding: 10,
                                width: 120,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src={signatureImg}
                                style={{
                                    width: '80%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                }}
                            />
                        </View>
                    </View>

                    <Text style={{ marginTop: 20, fontSize: 12 }}>
                        ติดต่อ โทร. 0999999999
                    </Text>
                </Page>
                <Page size="A4" style={{ padding: 40, fontFamily: 'THSarabun', fontSize: 14 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            textAlign: 'center',
                            fontFamily: 'THSarabun',
                            marginBottom: 10,
                        }}
                        render={({ pageNumber }) => `${pageNumber}`}
                        fixed
                    />
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                            What is Lorem Ipsum?
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'normal' }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 5 }}>
                                {'\t'}Lorem Ipsum 
                            </Text>
                            is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                            the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
                            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
                            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
                            Aldus PageMaker including versions of Lorem Ipsum.
                        </Text>
                    </View>
                </Page>
            </Document>

        );

        pdf(doc).toBlob().then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'employee-report.pdf';
            link.click();
            URL.revokeObjectURL(url);
        });
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
                                <Button className="btn btn-success" onClick={handleExport}>Export Excel</Button>
                                <Button className="btn btn-danger" onClick={handleExportPDF}>Export PDF</Button>
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
