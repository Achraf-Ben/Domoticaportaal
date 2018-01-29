import React, { Component } from 'react';
import {Table} from 'react-bootstrap';


class ModuleOverzicht extends Component {
  
  render() {
    return (
      <div id="modulestable">
        <Table striped bordered>
          <thead>
            <tr>
              <th> Modules </th>
              <th> Status </th>
            </tr>
        </thead>
        <tbody>
          
        </tbody>
        </Table>
      </div>
    )
  }
}

export default ModuleOverzicht
