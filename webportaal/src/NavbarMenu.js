import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class NavbarMenu extends Component {
  render() {
    return (

      <Navbar>
        <Nav pullLeft>
          <NavItem eventKey={1} href="#">
            <Link to={'/Gebruikers'}>Gebruikers</Link>
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={2} href="#">
            <Link to={'/Modules'}>Modules</Link>
          </NavItem>
        </Nav>
      </Navbar>

    );
  }
}

export default NavbarMenu
