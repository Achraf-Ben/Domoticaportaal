import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class EnkeleModuleOverzicht extends Component {
  render() {
    return (
      <Col sm={4}>

        <Table striped bordered>

          <thead>

            <tr>

              <th> Naam </th>
              <th> Locatie </th>
              <th> Camera status </th>
              <th> Module status </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td> Raspberry 1 </td>
              <td> Kamer 1 </td>
              <td> Uit </td>
              <td> Aan </td>

            </tr>

          </tbody>

        </Table>

      </Col>

    );
  }
}

export default EnkeleModuleOverzicht
