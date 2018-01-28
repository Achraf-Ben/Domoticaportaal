import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
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
      <form>

        <FormGroup>

          <Col sm={2}>
            <FormControl type="text" value="1" placeholder="ID:" />
          </Col>

        </FormGroup>

        <br/> <br/>

        <FormGroup>

          <Col sm={4}>
            <FormControl type="text" value="Mitchell" placeholder="Naam:" />
          </Col>

        </FormGroup>

        <br/>

        <FormGroup>

          <Col sm={4}>
            <FormControl type="text" value="Mitchell@Test.nl" placeholder="Email:" />
          </Col>

        </FormGroup>

        <FormGroup>

          <Col sm={10}>
            <Button type="submit">Opslaan</Button>
            <Button href="./Gebruikers">Back</Button>
          </Col>

        </FormGroup>

      </form>
    );
  }
}

export default Wijzigen
