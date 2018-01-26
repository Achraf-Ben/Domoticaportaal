import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Wijzigen extends Component {
  render() {
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
          </Col>

        </FormGroup>

      </form>
    );
  }
}

export default Wijzigen
