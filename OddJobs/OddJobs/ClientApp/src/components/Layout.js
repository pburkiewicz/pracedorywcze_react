import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './SideMenu';
import NavMenu from "./NavMenu";


export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
          <Container fluid style={{height: "100%"}}>
              <Row style={{height: "75px;", zIndex:"2"}} >
                  <NavMenu />
              </Row>
              <Row style={{height: "calc(100vh - 75px)"}}>
                  <Col className={"bg-dark fixed-top h-100"} style={{top: "75px", width: "75px", zIndex:"1"}}  >
                      <SideBar className={"fixed-top"}/>
                  </Col>
                  <Col className={"p-0 h-100"} style={{marginLeft: "75px", top: "75px", background: "#222831"}}>
                      {this.props.children}
                  </Col>
                  
              </Row>
          </Container>
    );
  }
}
