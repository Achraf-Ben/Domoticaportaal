import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button, Popover } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Alarmmelding extends Component {
  render() {
    return (
      <div id="alarmmeldingdiv">

        <Popover id="alarmmelding" placement="center" title="Alarm melding" >

          Alarm gaat af:

          <br /> <br />

          Kamer 1

          <br /> <br />

          20:10:05

          <br /> <br />

          <Button> Camera bekijken </Button>
          <Button> Alarm uitzetten </Button>

        </Popover>

      </div>
    );
  }
}

export default Alarmmelding
