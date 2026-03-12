import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { adminService } from '../../services/admin';
import { doctorService } from '../../services/doctor';
import { appointmentService } from '../../services/appointment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [newDept, setNewDept] = useState({ name: '', description: '' });
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        departmentId: '',
        specialization: '',
        experienceYears: '',
        consultationFee: '',
        role: 'doctor'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await adminService.getDashboardStats();
            setStats(statsRes.data);

            const deptsRes = await adminService.getDepartments();
            setDepartments(deptsRes.data);

            const docsRes = await doctorService.getAllDoctors();
            setDoctors(docsRes.data);

            const apptsRes = await appointmentService.getAllAppointments();
            setAppointments(apptsRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddDept = async (e) => {
        e.preventDefault();
        try {
            await adminService.addDepartment(newDept);
            setNewDept({ name: '', description: '' });
            fetchData();
        } catch (e) {
            alert("Failed to add department");
        }
    };

    const handleDeleteDept = async (id) => {
        try {
            await adminService.deleteDepartment(id);
            fetchData();
        } catch (e) {
            alert("Cannot delete department (it might be linked to doctors)");
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to remove this doctor?")) {
            try {
                await doctorService.deleteDoctor(id);
                fetchData();
            } catch (e) {
                alert("Cannot remove doctor");
            }
        }
    };

    const handleCancelAppt = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await appointmentService.updateStatus(id, 'CANCELLED');
                fetchData();
            } catch (e) {
                alert("Failed to cancel appointment");
            }
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const userStr = localStorage.getItem('user');
            let token = '';
            if (userStr) {
                const userObj = JSON.parse(userStr);
                token = userObj.accessToken || userObj.token || '';
            }
            
            const res = await fetch('http://localhost:8080/api/admin/register-doctor', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDoctor)
            });
            if (res.ok) {
                alert("Doctor added successfully!");
                setShowAddDoctor(false);
                setNewDoctor({
                    email: '',
                    password: '',
                    fullName: '',
                    phone: '',
                    departmentId: '',
                    specialization: '',
                    experienceYears: '',
                    consultationFee: '',
                    role: 'doctor'
                });
                fetchData();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to add doctor");
            }
        } catch (e) {
            alert("Error adding doctor");
        }
    };

    // Chart Data Preparation is here
    const apptStatusData = {
        labels: ['Confirmed', 'Completed', 'Pending/Other'],
        datasets: [{
            data: [
                stats.confirmedAppointments || 0,
                stats.completedAppointments || 0,
                (stats.totalAppointments || 0) - ((stats.confirmedAppointments || 0) + (stats.completedAppointments || 0))
            ],
            backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCD56'],
        }]
    };

    const overrideSystemData = {
        labels: ['Users', 'Doctors', 'Appointments'],
        datasets: [{
            label: 'Total Count',
            data: [stats.totalUsers || 0, stats.totalDoctors || 0, stats.totalAppointments || 0],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            <Tabs defaultActiveKey="analytics" className="mb-4">
                <Tab eventKey="analytics" title="Analytics">
                    <Row>
                        <Col md={3} className="mb-4">
                            <Card className="shadow-sm text-center bg-primary text-white">
                                <Card.Body>
                                    <h4>Total Users</h4>
                                    <h2>{stats.totalUsers || 0}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-4">
                            <Card className="shadow-sm text-center bg-success text-white">
                                <Card.Body>
                                    <h4>Total Doctors</h4>
                                    <h2>{stats.totalDoctors || 0}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-4">
                            <Card className="shadow-sm text-center bg-info text-white">
                                <Card.Body>
                                    <h4>Total Appointments</h4>
                                    <h2>{stats.totalAppointments || 0}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-4">
                            <Card className="shadow-sm text-center bg-warning text-dark">
                                <Card.Body>
                                    <h4>Completed Visits</h4>
                                    <h2>{stats.completedAppointments || 0}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Card className="shadow-sm mb-4">
                                <Card.Body>
                                    <h5 className="text-center">System Overview</h5>
                                    <div style={{ height: '300px' }}>
                                        <Bar data={overrideSystemData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm mb-4">
                                <Card.Body>
                                    <h5 className="text-center">Appointment Statuses</h5>
                                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                        <Pie data={apptStatusData} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="departments" title="Manage Departments">
                    <Row>
                        <Col md={4}>
                            <Card className="shadow-sm">
                                <Card.Header>Add Department</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleAddDept}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Department Name</Form.Label>
                                            <Form.Control type="text" value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={newDept.description} onChange={e => setNewDept({ ...newDept, description: e.target.value })} />
                                        </Form.Group>
                                        <Button type="submit" variant="primary" className="w-100">Add</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8}>
                            <Card className="shadow-sm">
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map(d => (
                                            <tr key={d.id}>
                                                <td>{d.id}</td>
                                                <td>{d.name}</td>
                                                <td>{d.description}</td>
                                                <td>
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteDept(d.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="doctors" title="Manage Doctors">
                    <Row className="mb-3 mt-3">
                        <Col className="text-end">
                            <Button variant="success" onClick={() => setShowAddDoctor(!showAddDoctor)}>
                                {showAddDoctor ? 'Close Form' : 'Add New Doctor'}
                            </Button>
                        </Col>
                    </Row>

                    {showAddDoctor && (
                        <Card className="shadow-sm mb-4">
                            <Card.Header>New Doctor Registration</Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleAddDoctor}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control type="text" value={newDoctor.fullName} onChange={e => setNewDoctor({ ...newDoctor, fullName: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Department</Form.Label>
                                                <Form.Select value={newDoctor.departmentId} onChange={e => setNewDoctor({ ...newDoctor, departmentId: e.target.value })} required>
                                                    <option value="">Select Department</option>
                                                    {departments.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Specialization</Form.Label>
                                                <Form.Control type="text" value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone</Form.Label>
                                                <Form.Control type="text" value={newDoctor.phone} onChange={e => setNewDoctor({ ...newDoctor, phone: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Experience (Years)</Form.Label>
                                                <Form.Control type="number" value={newDoctor.experienceYears} onChange={e => setNewDoctor({ ...newDoctor, experienceYears: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Consultation Fee ($)</Form.Label>
                                                <Form.Control type="number" value={newDoctor.consultationFee} onChange={e => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Initial Password</Form.Label>
                                                <Form.Control type="password" value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} required minLength="6" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button type="submit" variant="success">Register Doctor</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="shadow-sm">
                        <Table responsive hover>
                            <thead className="table-light">
                                <tr>
                                    <th>Doctor ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Specialization</th>
                                    <th>Consultation Fee</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(d => (
                                    <tr key={d.id}>
                                        <td>{d.id}</td>
                                        <td>Dr. {d.user.fullName}</td>
                                        <td>{d.department?.name}</td>
                                        <td>{d.specialization}</td>
                                        <td>${d.consultationFee}</td>
                                        <td>
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteDoctor(d.id)}>Remove</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Tab>

                <Tab eventKey="appointments" title="All Appointments">
                    <Card className="shadow-sm">
                        <Table responsive hover>
                            <thead className="table-light">
                                <tr>
                                    <th>Appt ID</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.patient?.fullName || a.patient?.email}</td>
                                        <td>Dr. {a.doctor?.user?.fullName}</td>
                                        <td>{new Date(a.appointmentDate).toLocaleString()}</td>
                                        <td>
                                            <Badge bg={
                                                a.status === 'CONFIRMED' ? 'primary' :
                                                    a.status === 'COMPLETED' ? 'success' :
                                                        a.status === 'CANCELLED' ? 'danger' : 'warning'
                                            }>
                                                {a.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                                                <Button size="sm" variant="danger" onClick={() => handleCancelAppt(a.id)}>Cancel</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;
