import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

var user_logged_in = true;

class GebruikersAanmaken extends Component {
  render() {
    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
    return(
      <Col sm={12}>
      <Form horizontal>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="text" placeholder="Username:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="password" placeholder="Wachtwoord:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <FormControl type="text" placeholder="Email:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={12}>
            <Button type="submit">Aanmaken</Button>
          </Col>

        </FormGroup>

      </Form>
      </Col>
    );
  }
}

export default GebruikersAanmaken
