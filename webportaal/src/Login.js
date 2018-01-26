import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Login extends Component {
  render() {
    return (
      <form>

        <FormGroup>

          <Col sm={4}>
            <FormControl type="text" placeholder="Username:" />
          </Col>

        </FormGroup>

        <br /> <br />

        <FormGroup>

          <Col sm={4}>
            <FormControl type="password" placeholder="Wachtwoord:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={10}>
            <Checkbox>Onthoud Mij</Checkbox>
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={10}>
            <Button type="submit">Inloggen</Button>
          </Col>

        </FormGroup>

      </form>
    );
  }
}

export default Login
