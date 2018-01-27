import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

var user_logged_in = true;

class Gebruikers extends Component {
  render() {
    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
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
              <td> <Link to={'./Wijzigen?id=1'}> Wijzigen </Link> </td>
              <td> Delete </td>

            </tr>

          </tbody>

        </Table>

      </Col>
    );
  }
}

export default Gebruikers
