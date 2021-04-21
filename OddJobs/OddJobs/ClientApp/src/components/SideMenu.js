import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";
import SubMenu from "./SubMenu";


const SideBar = ({ isOpen, toggle }) => (
    <div className={classNames(  "sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
      {/*<span color="info" onClick={toggle} style={{ color: "#fff" }}>*/}
      {/*  &times;*/}
      {/*</span>*/}
        <h3>Bootstrap Sidebar</h3>
      </div>
      <div className="side-menu">
        <Nav color="dark" vertical className="list-unstyled pb-3">
          <p>Dummy Heading</p>
          <SubMenu title="Home" icon={faHome} items={submenus[0]} />
          <NavItem>
            <NavLink tag={Link} to={"/about"}>
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
              About
            </NavLink>
          </NavItem>
          <SubMenu title="Pages" icon={faCopy} items={submenus[1]} />
          <NavItem>
            <NavLink tag={Link} to={"/pages"}>
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              Portfolio
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={"/faq"}>
              <FontAwesomeIcon icon={faQuestion} className="mr-2" />
              FAQ
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={"/contact"}>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Contact
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
);

const submenus = [
  [
    {
      title: "Home 1",
      target: "Home-1",
    },
    {
      title: "Home 2",
      target: "Home-2",
    },
    {
      itle: "Home 3",
      target: "Home-3",
    },
  ],
  [
    {
      title: "Page 1",
      target: "Page-1",
    },
    {
      title: "Page 2",
      target: "Page-2",
    },
  ],
];

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
