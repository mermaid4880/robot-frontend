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
    width: "100%",
    height: "840px",
  },

  taskDetail: {
    height: "403px",
    width: "100%",
    margin: "10px 15px 7.5px 0px",
  },
  label: {
    fontSize: 14,
  },
  blankRow: {
    height: "15px",
  },
}));

function TaskTableAndDetail() {
  const classes = useStyles();
 
  return (
    <Card className={classes.taskDetail} raised> 
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

export default TaskTableAndDetail;
