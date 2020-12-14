//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Label } from "semantic-ui-react";
import { Row } from "reactstrap";
//elements
import UserTable from "./3_1_.UserTable.jsx";


//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    height: "413px",
    width: "100%",
    marginLeft: "0.5rem",
    marginRight: "1rem",
  },
  label: {
    fontSize: 14,
  },
  blankRow: {
    height: "15px",
  },
}));

function UserConfig() {
  const classes = useStyles();
 
  return (
    <Card className={classes.root} raised> 
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          <Label color="teal" ribbon>
            用户配置
          </Label>
          <Row className={classes.blankRow}></Row>
        </Typography>
        <UserTable />
      </CardContent>
    </Card>
  );
}

export default UserConfig;
