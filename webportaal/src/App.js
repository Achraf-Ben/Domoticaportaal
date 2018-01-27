import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Gebruikers from './Gebruikers';
import Modules from './Modules';
import EnkeleModuleOverzicht from './Enkelemodule';
import NavbarMenu from './NavbarMenu';
import Login from './Login';
import GebruikersAanmaken from './GebruikersAanmaken';
import Alarmmelding from './Alarmmelding';

class App extends Component {
  render() {
    return (
      <div>

        <NavbarMenu />

        <Route exact path='/Gebruikers' component={Gebruikers} />
        <Route exact path='/Modules' component={Modules} />
        <Route exact path='/Enkelemodule' component={EnkeleModuleOverzicht} />
        <Route exact path='/Login' component={Login} />
        <Route exact path='/GebruikersAanmaken' component={GebruikersAanmaken} />
        <Route exact path='/Alarmmelding' component={Alarmmelding} />

      </div>

    );
  }
}

export default App;
