//packages
import React, { useState } from "react";
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
} from "reactstrap";
//fuctions
import menuList from "../../functions/menuList";

function Navigation() {
  //————————————————————————————css
  const navStyle = {
    fontSize: "1.2rem"
    // position: "fixed",
    // width: "100%"
    // color: "aliceblue"
  };
  const titleStyle = {
    fontSize: "1.5rem",
    paddingRight: "3rem"
  };
  const subtitleStyle = {
    paddingRight: "0.8rem"
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar style={navStyle} color="info" light expand="lg">
        <NavbarBrand style={titleStyle}>{menuList.title.name}</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem style={subtitleStyle}>
              <NavLink href="/Home">{menuList.level1_1.name}</NavLink>
            </NavItem>
            <NavItem style={subtitleStyle}>
              <NavLink>{menuList.level1_2.name}</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle style={subtitleStyle} nav caret>
                {menuList.level1_3.title.name}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="/Tour">{menuList.level1_3.level2_1.name}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>{menuList.level1_3.level2_2.name}</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>
            <NavLink href="/">退出</NavLink>
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;
