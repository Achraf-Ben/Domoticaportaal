import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Alarmmelding extends Component {
  render() {
    return (
      <div>

        Alarm gaat af:

        <br /> <br />

        Kamer 1

        <br /> <br />

        20:10:05

        <br /> <br />

        <Button> Camera bekijken </Button>
        <Button> Alarm uitzetten </Button>

      </div>
    );
  }
}

export default Alarmmelding
