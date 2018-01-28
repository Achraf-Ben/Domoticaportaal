import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Request from 'superagent';
import _ from 'lodash';

var user_logged_in = true;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class Test extends Component {

  constructor(){
    super();
    this.state = {};
  }

  componentWillMount() {
    var moduleid = getParameterByName('id');
    var url = `http://localhost:3001/api/modules/getModuleWithID/${moduleid}`;
    Request.get(url).then((response) => {
      this.setState({
        modules: response.body
      })
    })
  }

  render(){

    var modules = _.map(this.state.modules, (module) => {
      return <tr>
              <td> {module.id}  </td>
              <td> {module.hostname} </td>
              <td> {module.ip} </td>
              <td> {module.module_status} </td>
              <td> {module.camera_status} </td>
              <td> {module.light_status} </td>
              <td> {module.mac_address} </td>
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
        <Col sm={5}>

          <Table striped bordered>

              <thead>

                <tr>

                  <th> ID </th>
                  <th> Hostname </th>
                  <th> IP </th>
                  <th> Module status </th>
                  <th> Camera status </th>
                  <th> Light status </th>
                  <th> Mac_address </th>

                </tr>

              </thead>

              <tbody>

                {modules}

              </tbody>

            </Table>

            <Button href="./Modules" > Back </Button>

          </Col>

        </div>
    );
  }
}

export default Test
