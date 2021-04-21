import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './SideMenu';
import NavMenu from "./NavMenu";
import Map from './LeafletMap';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
          <Container fluid>
              <Row>
                  <NavMenu />
              </Row>
              <Row style={{height: "100vh"}}>
                  <Col md={1} className={"bg-dark"}>
                      <SideBar />
                  </Col>
                  <Col md={11}>
                      {this.props.children}
                      <div style={{width:'100%', height: '100%'}}><Map/> </div>
                  </Col>
              </Row>
          </Container>
      </div>
    );
  }
}
