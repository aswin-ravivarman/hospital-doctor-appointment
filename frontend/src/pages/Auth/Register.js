import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { authService } from '../../services/auth';
import { adminService } from '../../services/admin';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'patient',
        fullName: '',
        phone: '',
        departmentId: '',
        specialization: '',
        experienceYears: '',
        consultationFee: ''
    });

    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only fetch departments if we register as a doctor, or fetch initially
        const fetchDepts = async () => {
            try {
                const res = await adminService.getDepartments();
                setDepartments(res.data || []);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(formData);
            setSuccess('Registration successful! You can now login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body className="p-5">
                            <h2 className="text-center mb-4">Create an Account</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>I am a</Form.Label>
                                    <Form.Select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="admin">Admin</option>
                                    </Form.Select>
                                </Form.Group>

                                {formData.role === 'doctor' && (
                                    <div className="border p-3 rounded mb-4 bg-light">
                                        <h5>Doctor Details</h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Department</Form.Label>
                                                    <Form.Select name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                                                        <option value="">Select Department</option>
                                                        {departments.map(d => (
                                                            <option key={d.id} value={d.id}>{d.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Specialization</Form.Label>
                                                    <Form.Control type="text" name="specialization" value={formData.specialization} onChange={handleChange} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Experience (Years)</Form.Label>
                                                    <Form.Control type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Consultation Fee ($)</Form.Label>
                                                    <Form.Control type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                <div className="d-grid mt-4">
                                    <Button variant="primary" type="submit" disabled={loading} size="lg">
                                        {loading ? 'Creating account...' : 'Register'}
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center mt-4">
                                Already have an account? <Link to="/login">Login here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
