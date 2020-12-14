import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Stage, Layer, Image, Rect, Text } from "react-konva";
import useImage from "use-image";
import mapUrl from "../../../images/map.jpg";
import robotUrl from "../../../images/robot.jpg";
// import { for } from "core-js/fn/symbol";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    marginLeft: "0.5rem",
    marginTop: "0.5rem",
    width: 1040,
    height: 495,
  },
});

function Map() {
  const classes = useStyles();
  //———————————————————————————————————————————————useRef
  const stageRef = useRef(); //<Stage>标签的ref
  const [mapImage] = useImage(mapUrl);
  const [robotImage] = useImage(robotUrl);
  const [color, setColor] = useState("green");
  var pos0 = [];
  for (var i = 0; i < 1; i++) {
    pos0[i] = { x: 0, y: 0 };
  }
  const [pos, setPos] = useState(pos0);

  function handleClick() {
    for (var i = 0; i < 1; i++) {
      if (pos[i].x >= 1256 || pos[i].y >= 310) {
        pos0[i].x = 10;
        pos0[i].y = 10;
      } else {
        pos0[i].x += 1256 * Math.random();
        pos0[i].y += 310 * Math.random();
      }
    }
    setPos(pos0);
  }
  var scaleBy = 1.01;
  function handleWheel(e) {
    //滚动缩放处理函数
    const stage = stageRef.current;
    // console.log("e=", e);
    // console.log("node=", stage);
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var pointer = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }

  setTimeout(handleClick, 1000);

  return (
    <Paper className={classes.root}>
      <Stage
        id="stage"
        width={1250}
        height={320}
        draggable
        onWheel={(e) => handleWheel(e)}
        ref={stageRef}
      >
        <Layer>
          <Text text="Try click on rect" />
          <Image x={10} y={10} width={1256} height={310} image={mapImage} />
        </Layer>
        <Layer>
          {pos.map((item, idx) => (
            <Image
              x={item.x}
              y={item.y}
              width={20}
              height={30}
              opacity={0.8}
              image={robotImage}
              key={idx}
              // onClick={handleClick}
            />
          ))}

          {/* //<Rect
          // x={pos.x}
          // y={pos.y}
          // width={10}
          // height={10}
          // fill={color}
          // shadowBlur={5}
          // onClick={handleClick}
          ///> */}
        </Layer>
      </Stage>
    </Paper>
  );
}

export default Map;
