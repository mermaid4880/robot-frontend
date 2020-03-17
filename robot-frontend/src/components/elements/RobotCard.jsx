//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Card,
  CardActions,
  CardContent
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginLeft: "0.5rem",
    minWidth: 275,
    backgroundColor: "#f9f7f7"
  },
  bullet: {
    display: "inline-block",
    margin: "2px 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    paddingTop: "1rem",
    fontSize: 14,
    marginBottom: 10
  }
});

function RobotCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root} raised>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          机器人信息
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          当前机器人：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          巡检任务名称：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          当前巡检状态
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          巡检节点总数：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          异常巡检点数：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          当前巡检点：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          预计巡检时间：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          巡检进度：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          已巡检点数：
        </Typography>
        <Typography className={classes.bullet} variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">详细信息</Button>
      </CardActions>
    </Card>
  );
}

export default RobotCard;
