import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

var user_logged_in = true;

class Wijzigen extends Component {
  render() {
    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
    return (
      <Form horizontal>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="text" value="1" placeholder="ID:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="text" value="Mitchell" placeholder="Naam:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="text" value="Mitchell@Test.nl" placeholder="Email:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <Button type="submit">Opslaan</Button>
            <Button href="./Gebruikers">Back</Button>
          </Col>

        </FormGroup>

      </Form>
    );
  }
}

export default Wijzigen
