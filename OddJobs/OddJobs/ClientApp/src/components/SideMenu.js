import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faList,
  faMapMarkedAlt,
  faEnvelope,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {NavItem, NavLink, Nav, Row, Col, Container, Navbar} from "reactstrap";
import { Link } from "react-router-dom";


const SideBar = ({ isOpen, toggle }) => (
    <div >
      <div className="side-menu">
        <Nav color="dark" vertical className="" >
          <NavItem className={"w-100"} color="dark" dark>
            <NavLink tag={Link} to={"/add"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}} >
              <Row>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <FontAwesomeIcon icon={faPlus} size={"2x"} />
                </Col>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <p style={{fontSize: "13px"}}>Dodaj</p>
                </Col>
              </Row>
            </NavLink>
          </NavItem>
          <NavItem className={"w-100"}>
            <NavLink tag={Link} to={"/map"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}} >
              <Row>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <FontAwesomeIcon icon={faMapMarkedAlt} size={"2x"} />
                </Col>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <p style={{fontSize: "13px"}}>Mapa</p>
                </Col>
              </Row>
            </NavLink>
          </NavItem>
          
          <NavItem className={"w-100"}>
            <NavLink tag={Link} to={"/list"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}} >
              <Row>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <FontAwesomeIcon icon={faList} size={"2x"} />
                </Col>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <p style={{fontSize: "13px"}}>Lista</p>
                </Col>
              </Row>
            </NavLink>
          </NavItem>

          <NavItem className={"w-100"}>
            <NavLink tag={Link} to={"/messages"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}} >
              <Row>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <FontAwesomeIcon icon={faEnvelope} size={"2x"} />
                </Col>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <p style={{fontSize: "13px"}}>Wiadomości</p>
                </Col>
              </Row>
            </NavLink>
          </NavItem>

          <NavItem className={"w-100"}>
            <NavLink tag={Link} to={"/user"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}} >
              <Row>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <FontAwesomeIcon icon={faUserAlt} size={"2x"} />
                </Col>
                <Col md={12} className={"d-flex justify-content-center"}>
                  <p style={{fontSize: "13px"}}>Użytkownik</p>
                </Col>
              </Row>
            </NavLink>
          </NavItem>
          
        </Nav>
      </div>
    </div>
);

export default SideBar;



// import React, { Component } from 'react';
// import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import { LoginMenu } from './api-authorization/LoginMenu';
// import './NavMenu.css';


// export class NavMenu extends Component {
//   static displayName = NavMenu.name;
//
//   constructor (props) {
//     super(props);
//
//     this.toggleNavbar = this.toggleNavbar.bind(this);
//     this.state = {
//       collapsed: true
//     };
//   }
//
//   toggleNavbar () {
//     this.setState({
//       collapsed: !this.state.collapsed
//     });
//   }
//
//   render () {
//     return (
//       <header>
//         <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
//           <Container>
//             <NavbarBrand tag={Link} to="/">OddJobs</NavbarBrand>
//             <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//             <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//               <ul className="navbar-nav flex-grow">
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
//                 </NavItem>
//                 <LoginMenu>
//                 </LoginMenu>
//               </ul>
//             </Collapse>
//           </Container>
//         </Navbar>
//       </header>
//     );
//   }
// }
