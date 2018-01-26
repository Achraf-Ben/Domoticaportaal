import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Gebruikers from './Gebruikers';
import Modules from './Modules';
import EnkeleModuleOverzicht from './Enkelemodule';
import NavbarMenu from './NavbarMenu';

class App extends Component {
  render() {
    return (
      <div>

        <NavbarMenu />

        <Route exact path='/Gebruikers' component={Gebruikers} />
        <Route exact path='/Modules' component={Modules} />
        <Route exact path='/Enkelemodule' component={EnkeleModuleOverzicht} />

      </div>
    );
  }
}

export default App;
