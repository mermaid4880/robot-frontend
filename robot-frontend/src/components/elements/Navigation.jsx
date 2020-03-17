//packages
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  navbar: {
    fontSize: "1.2rem",
    backgroundColor: "#71c9ce"
    // position: "fixed",
    // width: "100%"
  },
  navbarBrand: {
    fontSize: "1.5rem",
    paddingRight: "3rem"
  },
  navItem: {
    paddingRight: "0.8rem"
  }
});

function Navigation() {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Paper elevation="10">
      <Navbar light expand="lg" className={classes.navbar}>
        <NavbarBrand className={classes.navbarBrand}>
          {menuList.title.name}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem className={classes.navItem}>
              <Link to="/Home">
                <NavLink>{menuList.level1_1.name}</NavLink>
              </Link>
            </NavItem>
            <NavItem className={classes.navItem}>
              <NavLink>{menuList.level1_2.name}</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle className={classes.navItem} nav caret>
                {menuList.level1_3.title.name}
              </DropdownToggle>
              <DropdownMenu right>
                <Link to="/TaskMgr">
                  <DropdownItem>{menuList.level1_3.level2_1.name}</DropdownItem>
                </Link>
                <DropdownItem divider />
                <Link to="/TaskShow">
                  <DropdownItem>{menuList.level1_3.level2_2.name}</DropdownItem>
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>
            <Link to="/">
              <NavLink>退出</NavLink>
            </Link>
          </NavbarText>
        </Collapse>
      </Navbar>
    </Paper>
  );
}

export default Navigation;
