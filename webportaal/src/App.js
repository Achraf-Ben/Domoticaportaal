import React, { Component } from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';
import Gebruikers from './Gebruikers/';
import Modules from './Modules/';
import NavbarMenu from './NavbarMenu';
import Login from './Login/';
import io from 'socket.io-client';
import './App.css';

function withProps(Component, props) {
  return function(matchProps) {
    return <Component {...props} {...matchProps} />
  }
}

const Main = (props) => (
  <div>
    <NavbarMenu />
    <Switch>   
      <Route exact path='/gebruikers' component={withProps(Gebruikers, {'socket': props.socket})} />
      <Route exact path='/modules' component={withProps(Modules, {'socket': props.socket})} />
      <Redirect from="/" to="/modules" />
    </Switch>
  </div>
);

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
      user:user, 
      socket_server:'http://localhost',
      alarm: false,
      alarm_module:null
    }
  }

  setUser(user){
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({'user':user});
  }  

  render() {

    const socket = io(this.state.socket_server);
    socket.on('alarm', function(module){
      module = JSON.parse(module);
      this.setState({alarm:true, alarm_module:module});
      console.log(this.state);
    });

    let view = this.state.user ? <Main socket={socket} /> : <LoginMain setUser={this.setUser.bind(this)}/>;

    return (
      <div>
        { view }
      </div>
    );
  }
}

export default App;
