import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Request from 'superagent';
import _ from 'lodash';
import EnkeleModuleOverzicht from './Enkelemodule';

var user_logged_in = true;

class ModuleOverzicht extends Component {

  constructor(){
    super();
    this.state = {};
  }

  componentWillMount() {
    var url = "http://localhost:3001/api/modules/getModule";
    Request.get(url).then((response) => {
      this.setState({
        modules: response.body
      })
    })
  }

  render(){

    var modules = _.map(this.state.modules, (module) => {
      return <tr>
          <td> <Link to={`./Enkelemodule?id=${module.id}`}> {module.hostname} </Link> </td>
          <td> {module.module_status} </td>
        </tr>;
    });

    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
    return (
      <div id = "modulestable">
        <Col sm={12}>

          <Table striped bordered>

              <thead>

                <tr>

                  <th> Hostname </th>
                  <th> Module status </th>

                </tr>

              </thead>

              <tbody>

                {modules}

              </tbody>

            </Table>

          </Col>

        </div>
    );
  }
}

export default ModuleOverzicht
