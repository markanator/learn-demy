import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { logoutUser } from '../async/api/auth';
import { useAuth } from '../context/auth.context';

const TopNav = () => {
  const { dispatch, state } = useAuth();
  const { user } = state;
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      toast.success('Logged out successfully');
      dispatch({ type: 'LOGOUT' });
      router.push('/');
    } catch (error) {
      toast.error('Logged out failed. Please try again');
      console.error(error?.response?.data?.message);
    }
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>Learnwind</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>Learnwind</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <>
                {user && user?.role && user?.role?.includes('Instructor') ? (
                  <Nav.Item>
                    <Link href="/instructor/course/create" passHref>
                      <Nav.Link>Create a Course</Nav.Link>
                    </Link>
                  </Nav.Item>
                ) : (
                  user?.role?.includes('Subscriber') && (
                    <Nav.Item>
                      <Link href="/user/apply" passHref>
                        <Nav.Link>Instructor Signup</Nav.Link>
                      </Link>
                    </Nav.Item>
                  )
                )}
              </>

              {user?.role && user?.role?.includes('Instructor') && (
                <Nav.Item>
                  <Link href="/instructor" passHref>
                    <Nav.Link>Instructors</Nav.Link>
                  </Link>
                </Nav.Item>
              )}

              {user === null ? (
                <>
                  <Nav.Item>
                    <Link href="/login" passHref>
                      <Nav.Link>Login</Nav.Link>
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link href="/register" passHref>
                      <Nav.Link>Register</Nav.Link>
                    </Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <NavDropdown title={user?.name + ' '} className="me-4" placement="bottom-end">
                    <Link href="/user" passHref>
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/" onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default TopNav;
