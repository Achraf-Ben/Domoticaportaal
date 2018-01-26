import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import EnkeleModuleOverzicht from './Enkelemodule';

class ModuleOverzicht extends Component {
  render() {
    return (
      <div>
      <Col sm={3}>

        <Table striped bordered>

          <thead>

            <tr>

              <th> Modules </th>
              <th> Status </th>

            </tr>

        </thead>

        <tbody>

          <tr>

            <td> <Link to={'./Enkelemodule?id=1'}> Raspberry 1 </Link> </td>
            <td> Aan </td>

          </tr>

          <tr>

            <td> <Link to={'./Enkelemodule?id=2'}> Raspberry 2 </Link> </td>
            <td> Uit </td>

          </tr>

        </tbody>

        </Table>

      </Col>

    </div>

    )
  }
}

export default ModuleOverzicht
