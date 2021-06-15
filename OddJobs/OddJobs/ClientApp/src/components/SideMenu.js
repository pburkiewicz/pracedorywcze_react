import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faList,
  faMapMarkedAlt,
  faEnvelope,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {NavItem, NavLink, Nav, Row, Col} from "reactstrap";
import { Link } from "react-router-dom";
import './css/menu.css'
import authService from "./api-authorization/AuthorizeService";

const SideBar = () => {

  // const unreadMessages = async () =>{
  //   const token = await authService.getAccessToken();
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  //   };
  //
  //   await fetch('message/api/unread', requestOptions)
  //       .then(async response => {
  //         let result = await response.json();
  //         console.log(unread);
  //         setUnread({unread: result});
  //       })
  // }
  //
  // useEffect(async () => await unreadMessages(),[])

  return (<div>
    <div className="side-menu">
      <Nav color="dark" vertical className="">
        <NavItem className={"w-100 mt-2"} color="dark" dark>
          <NavLink tag={Link} to={"/add"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}}
                   onHover={(e) => console.log(e)}>
            <Row>
              <Col md={12} className={"d-flex justify-content-center"}>
                <FontAwesomeIcon icon={faPlus} size={"2x"}/>
              </Col>
              <Col md={12} className={"d-flex justify-content-center"}>
                <p style={{fontSize: "12px"}}>Dodaj</p>
              </Col>
            </Row>
          </NavLink>
        </NavItem>
        <NavItem className={"w-100"}>
          <NavLink tag={Link} to={"/map"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}}>
            <Row>
              <Col md={12} className={"d-flex justify-content-center"}>
                <FontAwesomeIcon icon={faMapMarkedAlt} size={"2x"}/>
              </Col>
              <Col md={12} className={"d-flex justify-content-center"}>
                <p style={{fontSize: "12px"}}>Mapa</p>
              </Col>
            </Row>
          </NavLink>
        </NavItem>

        <NavItem className={"w-100"}>
          <NavLink tag={Link} to={"/list"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}}>
            <Row>
              <Col md={12} className={"d-flex justify-content-center"}>
                <FontAwesomeIcon icon={faList} size={"2x"}/>
              </Col>
              <Col md={12} className={"d-flex justify-content-center"}>
                <p style={{fontSize: "12px"}}>Lista</p>
              </Col>
            </Row>
          </NavLink>
        </NavItem>

        <NavItem className={"w-100"}>
          <NavLink tag={Link} to={"/threads"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}}>
            <Row>
              <Col md={12} className={"d-flex justify-content-center"}>
                <FontAwesomeIcon icon={faEnvelope} size={"2x"}/>
                {/*{ !unread ? <FontAwesomeIcon icon={faEnvelope} size={"2x"}/> :*/}
                {/*<FontAwesomeIcon icon={faEnvelope} size={"2x"} color={"red"}/>}*/}
              </Col>
              <Col md={12} className={"d-flex justify-content-center"}>
                <p style={{fontSize: "12px"}}>Wiadomości</p>
              </Col>
            </Row>
          </NavLink>
        </NavItem>

        {/*<NavItem className={"w-100"}>*/}
        {/*  <NavLink tag={Link} to={"/user"} className={"p-0 pt-2"} style={{color: '#d5d5d5', textDecoration: 'none'}}>*/}
        {/*    <Row>*/}
        {/*      <Col md={12} className={"d-flex justify-content-center"}>*/}
        {/*        <FontAwesomeIcon icon={faUserAlt} size={"2x"}/>*/}
        {/*      </Col>*/}
        {/*      <Col md={12} className={"d-flex justify-content-center"}>*/}
        {/*        <p style={{fontSize: "12px"}}>Użytkownik</p>*/}
        {/*      </Col>*/}
        {/*    </Row>*/}
        {/*  </NavLink>*/}
        {/*</NavItem>*/}

      </Nav>
    </div>
  </div>)
};

export default SideBar;

