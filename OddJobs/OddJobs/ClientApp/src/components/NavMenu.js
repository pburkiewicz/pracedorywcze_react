import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';
import {faBriefcase} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NavMenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
            <Navbar color="dark" dark expand="md" className={"w-100 p-0"}>
                <div className={"col-md-2 m-0 p-2 pl-3 d-flex align-items-center"} style={{background: "#1f1e1e"}}>
                                        
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" size="2x" style={{color: "#FFF"}} />
                    <NavbarBrand href="/">Prace Dorywcze</NavbarBrand>
                </div>
                {/*<NavbarToggler onClick={toggle} />*/}
                <Collapse isOpen={isOpen} navbar className={"p-2 pr-3"}>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/">Zarejestruj</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/">Zaloguj</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
    );
}

export default NavMenu;
