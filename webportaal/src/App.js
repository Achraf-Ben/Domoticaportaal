import React, { Component } from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';
import Gebruikers from './Gebruikers/';
import Modules, {CameraModal} from './Modules/';
import NavbarMenu from './NavbarMenu';
import Login from './Login/';
import io from 'socket.io-client';
import { Table, Modal, Form, FormControl, ControlLabel, Button, ButtonToolbar, FormGroup, Row, Col } from 'react-bootstrap';
import './App.css';

function withProps(Component, props) {
  return function(matchProps) {
    return <Component {...props} {...matchProps} />
  }
}

const AlarmModal = props => (
  <Modal.Dialog>
    <Modal.Header>
      <Modal.Title>Gebruiker Bewerken</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormGroup controlId="email" bsSize="large">
      <ControlLabel>Email</ControlLabel>
      <FormControl type="text"/>
    </FormGroup>
    <FormGroup controlId="password" bsSize="large">
      <ControlLabel>Password</ControlLabel>
      <FormControl />
    </FormGroup>
    <FormGroup controlId="passwordCheck" bsSize="large">
      <ControlLabel>Password</ControlLabel>
      <FormControl  type="text"/>
    </FormGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button type="submit" onClick={props.deactivate_alarm} bsStyle="primary">Zet uit</Button>
    </Modal.Footer>
  </Modal.Dialog>
)

class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
      socket_server:'http://localhost',
      alarm: false,
      alarm_module:null
    }
  }

  deactivate_alarm(){
    const socket = io(this.state.socket_server);
    socket.emit('alarm_off', {id:this.state.alarm_module.id})
    this.setState({alarm:false, alarm_module:null})

  }

  render(){

    const socket = io(this.state.socket_server);
    socket.on('alarm', function(module){
      this.setState({alarm:true, alarm_module:module});
      console.log(this.state);
    }.bind(this));

    let cameramodal = null;

    if(this.state.alarm){
      let videostream = <img src={'http://'+this.state.alarm_module.ip+':10088/?action=stream'} alt=""/>
      cameramodal = <CameraModal videostream={videostream} closeModal={this.deactivate_alarm.bind(this)}/>
    }

    return (
      <div>
        {cameramodal}
        <NavbarMenu />
        <Switch>   
          <Route exact path='/gebruikers' component={withProps(Gebruikers, {'socket': socket})} />
          <Route exact path='/modules' component={withProps(Modules, {'socket': socket})} />
          <Redirect from="/" to="/modules" />
        </Switch>
      </div>
    );
  } 
};

const LoginMain = (props) => (
  <Switch>
    <Route path='/login' component={withProps(Login, {setUser:props.setUser})} />          
    <Redirect push to={"/login"} />
  </Switch>
);


class App extends Component {

  constructor(props){
    super(props);

    var user = JSON.parse(localStorage.getItem('user'));
    this.state = {
      user:user
    }
  }

  setUser(user){
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({'user':user});
  }  

  render() {

    let view = this.state.user ? <Main /> : <LoginMain setUser={this.setUser.bind(this)}/>;

    return (
      <div>
        { view }
      </div>
    );
  }
}

export default App;
