import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class NavbarMenu extends Component {
  render() {
    return (

      <Navbar>
        <Nav>
        <NavItem eventKey={1} href="#">
          <Link to={'/Modules'}> Home </Link>
        </NavItem>
        </Nav>
        <Nav pullLeft>
          <NavDropdown eventKey={2} title="Gebruikers" href="#">
            <MenuItem eventKey={2.1} href="#">
              <Link to={'/GebruikersAanmaken'}>Gebruikers aanmaken</Link>
            </MenuItem>
            <MenuItem eventKey={2.2} href="#">
              <Link to={'/Gebruikers'}>Gebruikers bekijken</Link>
            </MenuItem>
           </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={3} href="#">
            <Link to={'/Modules'}>Modules</Link>
          </NavItem>
        </Nav>
      </Navbar>

    );
  }
}

export default NavbarMenu
