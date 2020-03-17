//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import UserForm from "../elements/UserForm";
//images
import ImageBackground from "../../images/PageLogin-bg.png";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: "0",
    width: "100%",
    height: "937px",
    backgroundImage: `url(${ImageBackground})`
  },
  row: {
    paddingTop: "40%"
  }
}));

function PageLogin() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>
        <Row className={classes.row}>
          <Col sm={{ size: 4, order: 2, offset: 4 }}>
            <UserForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PageLogin;
