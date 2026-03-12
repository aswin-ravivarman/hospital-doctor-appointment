import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Tab, Tabs } from 'react-bootstrap';
import { doctorService } from '../../services/doctor';
import { appointmentService } from '../../services/appointment';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [newSlot, setNewSlot] = useState({
        availabilityDate: '',
        startTime: '',
        endTime: ''
    });

    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        try {
            // User context doesn't have doctor ID directly, it has user ID.
            // We need to fetch the doctor entity for this user first
            // Actually we have a getDoctor by User Id? Let's check or handle it.
            // Wait, we didn't expose /api/doctors/user/{userId}. Let's assume user.id can be mapped if backend handled this properly
            // We will just fetch doctors and find ours.
            const docsRes = await doctorService.getAllDoctors();
            const myDoc = docsRes.data.find(d => d.user.id === user.id);

            if (myDoc) {
                setDoctorId(myDoc.id);

                const apptRes = await appointmentService.getAppointmentsByDoctor(myDoc.id);
                setAppointments(apptRes.data);

                const availRes = await doctorService.getAvailabilityByDoctor(myDoc.id);
                setAvailability(availRes.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await appointmentService.updateStatus(id, status);
            fetchData();
        } catch (e) {
            alert("Status update failed.");
        }
    };

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        try {
            await doctorService.addAvailability(doctorId, newSlot);
            setNewSlot({ availabilityDate: '', startTime: '', endTime: '' });
            fetchData();
        } catch (e) {
            alert("Failed to add slot.");
        }
    };

    const deleteSlot = async (id) => {
        try {
            await doctorService.deleteAvailability(id);
            fetchData();
        } catch (e) {
            alert("Failed to delete slot.");
        }
    };

    // Group appointments by date
    const groupedAppointments = appointments.reduce((acc, appt) => {
        const date = new Date(appt.appointmentDate).toLocaleDateString();
        if(!acc[date]) acc[date] = [];
        acc[date].push(appt);
        return acc;
    }, {});
    const sortedDates = Object.keys(groupedAppointments).sort((a,b) => new Date(a) - new Date(b));

    return (
        <Container className="py-4">
            <h2 className="mb-4">Doctor Dashboard</h2>

            <Tabs defaultActiveKey="appointments" className="mb-4">
                <Tab eventKey="appointments" title="Appointments (Day-wise)">
                    <Card className="shadow-sm">
                        <Card.Body>
                            {appointments.length === 0 ? (
                                <div className="text-center py-4">No appointments found.</div>
                            ) : (
                                sortedDates.map(date => (
                                    <div key={date} className="mb-4">
                                        <h5 className="border-bottom pb-2 text-primary">{date}</h5>
                                        <Table responsive hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Time</th>
                                                    <th>Patient Name</th>
                                                    <th>Reason</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedAppointments[date].map(appt => (
                                                    <tr key={appt.id}>
                                                        <td>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                        <td>{appt.patient.fullName || appt.patient.username}</td>
                                                        <td>{appt.reason}</td>
                                                        <td>
                                                            <Badge bg={
                                                                appt.status === 'CONFIRMED' ? 'primary' :
                                                                    appt.status === 'COMPLETED' ? 'success' :
                                                                        appt.status === 'PENDING' ? 'warning' : 'danger'
                                                            }>
                                                                {appt.status}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            {appt.status === 'PENDING' && (
                                                                <>
                                                                    <Button size="sm" variant="success" className="me-2 mb-1" onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}>Confirm</Button>
                                                                    <Button size="sm" variant="danger" className="mb-1" onClick={() => handleStatusUpdate(appt.id, 'REJECTED')}>Reject</Button>
                                                                </>
                                                            )}
                                                            {appt.status === 'CONFIRMED' && (
                                                                <Button size="sm" variant="info" className="text-white" onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}>Complete</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="availability" title="Manage Availability">
                    <Row>
                        <Col md={4}>
                            <Card className="shadow-sm mb-4">
                                <Card.Header className="bg-primary text-white">Add Time Slot</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleAddAvailability}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control type="date" required
                                                value={newSlot.availabilityDate}
                                                onChange={e => setNewSlot({ ...newSlot, availabilityDate: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Start Time</Form.Label>
                                            <Form.Control type="time" required
                                                value={newSlot.startTime}
                                                onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>End Time</Form.Label>
                                            <Form.Control type="time" required
                                                value={newSlot.endTime}
                                                onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Button type="submit" variant="primary" className="w-100">Add Slot</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={8}>
                            <Card className="shadow-sm">
                                <Card.Header>Your Available Slots</Card.Header>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availability.map(slot => (
                                            <tr key={slot.id}>
                                                <td>{slot.availabilityDate}</td>
                                                <td>{slot.startTime} - {slot.endTime}</td>
                                                <td>
                                                    <Badge bg={slot.isBooked ? 'danger' : 'success'}>
                                                        {slot.isBooked ? 'Booked' : 'Available'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {!slot.isBooked && (
                                                        <Button size="sm" variant="outline-danger" onClick={() => deleteSlot(slot.id)}>Delete</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {availability.length === 0 && (
                                            <tr><td colSpan="4" className="text-center">No availability slots configured.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default DoctorDashboard;
