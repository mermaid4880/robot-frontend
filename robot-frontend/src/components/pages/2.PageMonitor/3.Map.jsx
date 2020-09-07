import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Stage, Layer, Image, Rect, Text } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import mapUrl from "../../../images/map.jpg";
import robotUrl from "../../../images/robot.jpg";

const useStyles = makeStyles({
  root: {
    marginLeft: "0.5rem",
    marginTop: "0.5rem",
    width: 1250
  }
});

function Map() {
  const classes = useStyles();

  const [mapImage] = useImage(mapUrl);
  const [robotImage] = useImage(robotUrl);
  const [color, setColor] = useState("green");
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleClick() {
    // setColor(Konva.Util.getRandomColor());
    if (pos.x >= 1256 || pos.y >= 310) {
      setPos({ x: 10, y: 10 });
    } else {
      setPos({ x: pos.x + 5, y: pos.y + 2 });
    }
  }

  setTimeout(handleClick, 1000);

  return (
    <Paper className={classes.root}>
      <Stage width={1250} height={320}>
        <Layer>
          <Text text="Try click on rect" />
          <Image x={10} y={10} width={1256} height={310} image={mapImage} />
        </Layer>
        <Layer>
          <Image
            x={pos.x}
            y={pos.y}
            width={20}
            height={30}
            opacity={0.8}
            image={robotImage}
            // onClick={handleClick}
          />
          <Rect
          // x={pos.x}
          // y={pos.y}
          // width={10}
          // height={10}
          // fill={color}
          // shadowBlur={5}
          // onClick={handleClick}
          />
        </Layer>
      </Stage>
    </Paper>
  );
}

export default Map;
