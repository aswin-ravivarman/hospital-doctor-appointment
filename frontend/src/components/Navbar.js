import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'ROLE_ADMIN') return '/admin';
        if (user.role === 'ROLE_DOCTOR') return '/doctor';
        return '/patient';
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm py-3">
            <Container>
                <BootstrapNavbar.Brand as={Link} to={getDashboardLink()} className="fw-bold">
                    🏥 Smart Hospital Appointment
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <Nav.Link as={Link} to={getDashboardLink()}>Dashboard</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to={user.role === 'ROLE_ADMIN' ? '/admin' : user.role === 'ROLE_DOCTOR' ? '/doctor' : '/patient'} className="text-light me-3 d-flex align-items-center">
                                    Dashboard ({user.fullName || user.email})
                                </Nav.Link>
                                <Button variant="outline-light" onClick={handleLogout} size="sm">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

// Helper component since react-bootstrap's Navbar.Text seems weird sometimes
const NavbarText = ({ children, className }) => (
    <span className={className}>{children}</span>
);
