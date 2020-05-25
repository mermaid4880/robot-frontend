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
  NavbarText,
} from "reactstrap";

const useStyles = makeStyles({
  root: {
    fontSize: "1.2rem",
    backgroundColor: "#71c9ce",
    // position: "fixed",
    // width: "100%"
  },
  brand: {
    fontSize: "1.5rem",
    paddingRight: "3rem",
  },
  item: {
    paddingRight: "1rem",
  },
});

function Navigation() {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Paper elevation="10">
      <Navbar light expand="lg" className={classes.root}>
        <NavbarBrand className={classes.brand}>智能巡检机器人系统</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem className={classes.item}>
              <Link to="/Monitor">
                <NavLink>实时监控</NavLink>
              </Link>
            </NavItem>
            <NavItem className={classes.item}>
              <Link to="/TaskMgr">
                <NavLink>任务管理</NavLink>
              </Link>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle className={classes.item} nav caret>
                巡检记录
              </DropdownToggle>
              <DropdownMenu right>
                <Link to="/AllRecords">
                  <DropdownItem>全部巡检记录</DropdownItem>
                </Link>
                <DropdownItem divider />
                <Link to="/OneMeterRecords">
                  <DropdownItem>点位巡检记录</DropdownItem>
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem className={classes.item}>
              <Link to="/AlertMgr">
                <NavLink>异常告警</NavLink>
              </Link>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle className={classes.item} nav caret>
                系统配置
              </DropdownToggle>
              <DropdownMenu right>
                <Link to="">
                  <DropdownItem>机器人管理</DropdownItem>
                </Link>
                <DropdownItem divider />
                <Link to="/UserMgr">
                  <DropdownItem>用户管理</DropdownItem>
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
