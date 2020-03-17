import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Paper, Typography, TextField, Button } from "@material-ui/core";

const data = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1"
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4"
        }
      ]
    }
  ]
};

const useStyles = makeStyles({
  root: {
    height: 830,
    backgroundColor: "#f9f7f7"
  },
  title: {
    padding: 12,
    paddingLeft: 40,
    backgroundColor: "#f5eee6"
  },
  tree: {    
    flexGrow: 1,
    maxWidth: 800,
    padding: 50,
    paddingTop:20
  },
  input: {
    marginTop: 15,
    marginLeft: 45
  },
  button:{
    marginTop: 18,
    marginLeft: 25
  }
});

function Tree() {
  const classes = useStyles();

  const renderTree = nodes => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Paper className={classes.root} elevation="5">
      <Typography className={classes.title} variant="h6" gutterBottom>
        点位树
      </Typography>
      <TextField
        className={classes.input}
        size="small"
        margin="dense"
        id="outlined-basic"
        label="关键字查询"
        variant="outlined"
      />
      <Button className={classes.button} variant="outlined" component="span">
        查询
      </Button>
      <TreeView
        className={classes.tree}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(data)}
      </TreeView>
    </Paper>
  );
}

export default Tree;
