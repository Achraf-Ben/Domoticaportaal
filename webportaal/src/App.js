import React, { Component } from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';
import Gebruikers from './Gebruikers/';
import Modules from './Modules/';
import NavbarMenu from './NavbarMenu';
import Login from './Login/';
import io from 'socket.io-client';
import { Modal, ControlLabel, Button, FormGroup } from 'react-bootstrap';
import './App.css';

function withProps(Component, props) {
  return function(matchProps) {
    return <Component {...props} {...matchProps} />
  }
}

const AlarmModal = props => (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>ALARM</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup bsSize="large">
          <ControlLabel>Module: {props.module_id}</ControlLabel>
        </FormGroup>
        <FormGroup bsSize="large">
          <ControlLabel>Tijdstip melding: {props.alarm_time}</ControlLabel>
        </FormGroup>
        {props.videostream}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.closeModal}>Alarm uitschakelen</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>
)

class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
      socket_server:'http://server.zorgtotaal.com',
      alarm: false,
      alarm_module:null
    }
  }

  deactivate_alarm(){
    const socket = io(this.state.socket_server);

    socket.on("connection", function(){
      console.log("socket connected");
    })

    socket.emit('alarm_off', {id:this.state.alarm_module.id})
    this.setState({alarm:false, alarm_module:null})

  }

  reloadVideoStream(){
    this.setState({videourl:'http://'+this.state.alarm_module.ip+':10088/?action=stream'});
  }

  render(){

    const socket = io(this.state.socket_server);
    socket.on('alarm', function(module){
      this.setState({alarm:true, alarm_module:module});
    }.bind(this));

    let cameramodal = null;

    if(this.state.alarm){
      var me = this;
      let videostream = <img src={'http://'+me.state.alarm_module.ip+':10088/?action=stream'} alt=""/>
      
      cameramodal = <AlarmModal videostream={videostream} closeModal={this.deactivate_alarm.bind(this)}/>
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
