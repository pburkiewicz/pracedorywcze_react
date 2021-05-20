import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import SideBar from './SideMenu';
import NavMenu from "./NavMenu";

export function Layout (props) {
 


    return (
      <div>
          <Container fluid style={{height: "100vh"}}>
              <Row style={{height: "10vh"}}>
                  <NavMenu />
              </Row>
              <Row style={{height: "90vh"}}>
                  <Col className={"bg-dark"} style={{maxWidth: "10vh"}}>
                      <SideBar />
                  </Col>
                  <Col className={"p-0 h-100"} style={{background: "#313131"}}>
                      {props.children}
                  </Col>
              </Row>
          </Container>
      </div>
    );
  
}
