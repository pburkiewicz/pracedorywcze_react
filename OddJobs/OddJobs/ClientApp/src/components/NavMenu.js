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
                <div className={"col-md-1 m-0 p-2 pl-0 d-flex align-items-center"} style={{background: "#1f1e1e"}}>
                                        
                    <FontAwesomeIcon icon={faBriefcase} className="mx-auto" size="4x" style={{color: "#d5d5d5"}} />
                    
                </div>
                <NavbarBrand href="/"  className={"col-md-1 pl-2"} style={{color: "#d5d5d5"}}>Prace Dorywcze</NavbarBrand>
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
