import React, { Component } from 'react';
import {Table, Modal, Button} from 'react-bootstrap';
import request from 'superagent';
import './Modules.css';

const CameraModal = props => (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Videostream</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       {props.videostream}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.closeModal}>Sluiten</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>
)

class Modules extends Component {
  
  constructor(props){
    super(props);
    this.state = {modules:[], showCamera:false}
  }

  componentDidMount(){
    this.getModules()
  }

  getModules(){
    var me = this;
    request
    .get('/api/modules/')
    .end(function(err, res){
      if(res.statusCode == 403){
        localStorage.removeItem('user');
        me.props.history.push('/');
        window.location.reload();
      } else {
        me.setState({modules:res.body});
      }
    });
  }

  showCamera(id){
    let module = {};

    if(!id) return;

    this.state.modules.forEach(function(mod){
      if(mod.id == id){
        module = mod;
      }
    });

    this.setState({showCamera:true, module:module});
  }

  closeModal(){
    this.setState({showCamera:false, module:{}});
  }

  render() {
    const socket = this.props.socket;
    socket.on('new_module', this.getModules.bind(this))
    socket.on('camera_on', this.getModules.bind(this))

    const modules = this.state.modules.map(module => (
      <tr onClick={() => this.showCamera(module.id)} key={module.id}>
        <td>{module.id}</td>
        <td>{module.ip}</td>
        <td>{module.mac_address}</td>
        <td>{module.status ? 'Verbonden' : "Niet verbonden"}</td>
      </tr>
    ));

    let form = null;
    if(this.state.showCamera){
      let videostream = <img src="/static.jpg" alt=""/>
      let module = this.state.module;

      if(module.camera_status){
        videostream = <img src={'http://'+module.ip+':10088/?action=stream'} alt=""/>
      } 

      form = <CameraModal videostream={videostream} closeModal={this.closeModal.bind(this)}/>
    }

    return (
      <div>
        {form}
        <Table striped bordered>
          <thead>
            <tr>
              <th> Module </th>
              <th> IPv4 </th>
              <th> MAC Adres </th>
              <th> Status </th>
            </tr>
        </thead>
        <tbody>
          {modules}
        </tbody>
        </Table>
      </div>
    )
  }
}

export default Modules
export {CameraModal}