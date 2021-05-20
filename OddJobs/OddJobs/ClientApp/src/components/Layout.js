import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './SideMenu';
import NavMenu from "./NavMenu";


export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
          
          <Container fluid style={{height: "92vh"}}>
              <Row style={{height: "75px;", zIndex:"2"}} >
                  <NavMenu />
              </Row>
              <Row style={{height: "100%"}}>
                  <Col className={"bg-dark fixed-top h-100"} style={{top: "75px", width: "75px", zIndex:"1"}}  >
                      <SideBar className={"fixed-top"}/>
                  </Col>
                  <Col className={"p-0 h-100"} style={{marginLeft: "75px", top: "75px", background: "#313131"}}>
                      {this.props.children}
                  </Col>
                  
              </Row>
          </Container>
      </div>
    );
  }
}
