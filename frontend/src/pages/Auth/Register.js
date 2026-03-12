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
        fullName: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

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
