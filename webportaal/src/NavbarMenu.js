import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class NavbarMenu extends Component {
  render() {
    return (

      <Navbar>
        <Nav>
        <NavItem eventKey={1} href={"/gebruikers"}>
          Gebruikers
        </NavItem>
        <NavItem eventKey={2} href="/modules">
          Modules
        </NavItem>
        </Nav>
      </Navbar>

    );
  }
}

export default NavbarMenu
