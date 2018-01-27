import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

var user_logged_in = true;

class EnkeleModuleOverzicht extends Component {
  render() {
    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
    return (
      <Col sm={4}>

        <Table striped bordered>

          <thead>

            <tr>

              <th> Hostname </th>
              <th> Ip </th>
              <th> Module status</th>
              <th> Camera status </th>
              <th> Light status </th>
              <th> Mac-address </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td> Raspberry 1 </td>
              <td> 0.0.0.0 </td>
              <td> Aan </td>
              <td> Uit </td>
              <td> Aan </td>
              <td> 0.0.0.0 </td>

            </tr>

          </tbody>

        </Table>

        <Button href="./Modules" > Back </Button>

      </Col>

    );
  }
}

export default EnkeleModuleOverzicht
