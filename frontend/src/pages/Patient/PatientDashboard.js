import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button, Modal, ListGroup } from 'react-bootstrap';
import { adminService } from '../../services/admin';
import { doctorService } from '../../services/doctor';
import { appointmentService } from '../../services/appointment';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    // Selection state
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    // Doctor profile & booking
    const [availability, setAvailability] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bookingReason, setBookingReason] = useState('');

    // Appointments history
    const [myAppointments, setMyAppointments] = useState([]);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const deptsRes = await adminService.getDepartments();
            setDepartments(deptsRes.data);

            const docsRes = await doctorService.getAllDoctors();
            setDoctors(docsRes.data);
            setFilteredDoctors(docsRes.data);

            if (user && user.id) {
                const myApptsRes = await appointmentService.getAppointmentsByPatient(user.id);
                setMyAppointments(myApptsRes.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeptFilter = (e) => {
        const deptId = e.target.value;
        setSelectedDept(deptId);
        if (!deptId) {
            setFilteredDoctors(doctors);
        } else {
            setFilteredDoctors(doctors.filter(d => d.department?.id === parseInt(deptId)));
        }
    };

    const viewDoctor = async (doc) => {
        setSelectedDoctor(doc);
        setShowDoctorModal(true);
        try {
            const availRes = await doctorService.getAvailableSlots(doc.id);
            setAvailability(availRes.data);

            // We could use an actual API method for reviews (not implemented yet in services, let's create it inline)
            // Actually we have it in reviewService! Oh wait, I need to create review.service.js. 
            // Assuming we have it or will add it.
        } catch (e) {
            console.error(e);
            setAvailability([]);
        }
    };

    const handleBooking = async (slot) => {
        try {
            await appointmentService.bookAppointment(user.id, selectedDoctor.id, slot.id, bookingReason || "General Checkup");
            alert("Appointment booked successfully!");
            setShowDoctorModal(false);
            setBookingReason('');
            fetchData(); // refresh my appointments
        } catch (e) {
            alert(e.response?.data?.message || "Failed to book");
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="mb-4">Patient Dashboard</h2>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">Find a Doctor</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Filter by Department</Form.Label>
                                <Form.Select value={selectedDept} onChange={handleDeptFilter}>
                                    <option value="">All Departments</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-info text-white">My Appointments ({myAppointments.length})</Card.Header>
                        <ListGroup variant="flush">
                            {myAppointments.length === 0 ? (
                                <ListGroup.Item>No appointments found.</ListGroup.Item>
                            ) : (
                                myAppointments.map(appt => (
                                    <ListGroup.Item key={appt.id}>
                                        <strong>Dr. {appt.doctor.user.fullName}</strong><br />
                                        <small>{new Date(appt.appointmentDate).toLocaleString()}</small><br />
                                        <Badge bg={appt.status === 'CONFIRMED' ? 'success' : appt.status === 'PENDING' ? 'warning' : 'danger'}>
                                            {appt.status}
                                        </Badge>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={8}>
                    <div className="d-flex flex-wrap gap-4">
                        {filteredDoctors.map(doc => (
                            <Card key={doc.id} className="shadow-sm" style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>Dr. {doc.user?.fullName}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{doc.specialization}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Department:</strong> {doc.department?.name}<br />
                                        <strong>Experience:</strong> {doc.experienceYears} Years<br />
                                        <strong>Fee:</strong> ${doc.consultationFee}
                                    </Card.Text>
                                    <Button variant="outline-primary" onClick={() => viewDoctor(doc)}>View & Book</Button>
                                </Card.Body>
                            </Card>
                        ))}
                        {filteredDoctors.length === 0 && <p>No doctors found.</p>}
                    </div>
                </Col>
            </Row>

            <Modal show={showDoctorModal} onHide={() => setShowDoctorModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Doctor Profile: Dr. {selectedDoctor?.user?.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Details</h5>
                            <p>Specialization: {selectedDoctor?.specialization}</p>
                            <p>Experience: {selectedDoctor?.experienceYears} Years</p>
                            <p>Consultation Fee: ${selectedDoctor?.consultationFee}</p>
                        </Col>
                        <Col md={6}>
                            <h5>Book Appointment</h5>
                            <Form.Group className="mb-2">
                                <Form.Label>Reason for Visit</Form.Label>
                                <Form.Control type="text" placeholder="E.g., Follow-up, Checkup" value={bookingReason} onChange={e => setBookingReason(e.target.value)} />
                            </Form.Group>
                            <h6>Available Slots</h6>
                            {availability.length === 0 ? <p className="text-muted">No slots available right now.</p> : (
                                <ListGroup>
                                    {availability.map(slot => (
                                        <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                                            {slot.availabilityDate} ({slot.startTime} - {slot.endTime})
                                            <Button size="sm" variant="success" onClick={() => handleBooking(slot)}>Book</Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </Container>
    );
};

export default PatientDashboard;
