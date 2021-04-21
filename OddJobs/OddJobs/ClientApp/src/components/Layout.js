import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './SideMenu';
import NavMenu from "./NavMenu";

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
                  <Col md={2} className={"bg-dark"}>
                      <SideBar />
                  </Col>
                  <Col md={10}>
                      {this.props.children}
                  </Col>
              </Row>
          </Container>
      </div>
    );
  }
}
