import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import "../css/header.css";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };
  return (
    <header className="modern-header">
      <Navbar expand="lg" collapseOnSelect className="modern-navbar">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-logo">
              <span className="brand-text">KIU Hostel Management</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo && (
              <div className="nav-search">
                <Route render={({ history }) => <SearchBox history={history} />} />
              </div>
            )}
            <Nav className="ms-auto align-items-center">
              {userInfo && userInfo.isAdmin && (
                <LinkContainer to="/dashboard">
                  <Nav.Link className="nav-link-modern">Dashboard</Nav.Link>
                </LinkContainer>
              )}
              {userInfo && (
                <>
                  <NavDropdown title="Students" className="nav-dropdown-modern">
                    <LinkContainer to="/">
                      <NavDropdown.Item>All Students</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/addStudent">
                      <NavDropdown.Item>Add Student</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/attendance">
                      <NavDropdown.Item>Attendance</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/analysis">
                      <NavDropdown.Item>Reports</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  <NavDropdown title="Operations" className="nav-dropdown-modern">
                    <LinkContainer to="/rooms">
                      <NavDropdown.Item>Rooms</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/bookings">
                      <NavDropdown.Item>Bookings</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/payments">
                      <NavDropdown.Item>Payments</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/fees">
                      <NavDropdown.Item>Fees</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/complaints">
                      <NavDropdown.Item>Complaints</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/notices">
                      <NavDropdown.Item>Notices</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/notifications">
                      <NavDropdown.Item>Notifications</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/reports">
                      <NavDropdown.Item>Reports</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </>
              )}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username" className="user-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>My Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <LinkContainer to="/userList">
                        <NavDropdown.Item>User Management</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="logout-item">
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="login-link">Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
