import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Gebruikers extends Component {
  render() {
    return (
      <Col sm={3}>

        <Table striped bordered>

          <thead>

            <tr>

              <th> ID </th>
              <th> Naam </th>
              <th> Email </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td> 1 </td>
              <td> Mitchell </td>
              <td> Mitchell@Test.nl </td>
              <td> <Button href="./Wijzigen?id=1" color="second"> Wijzigen </Button> </td>
              <td> <Button color="danger"> Delete </Button> </td>

            </tr>

          </tbody>

        </Table>

      </Col>
    );
  }
}

export default Gebruikers
