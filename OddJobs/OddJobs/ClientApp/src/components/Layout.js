import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './NavMenu';
import Map from './LeafletMap';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
          <Container fluid>
              <Row style={{height: "100vh"}}>
                  <Col md={2} className={"bg-dark"}>
                      <SideBar />
                  </Col>
                  <Col md={9}>
                      <div style={{width:'100%', height: '100%'}}><Map/> </div>
                  </Col>
              </Row>
          </Container>
      </div>
    );
  }
}
