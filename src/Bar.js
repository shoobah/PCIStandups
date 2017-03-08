import React from "react";
import Moment from "moment";

const Bar = props => {
  const start = Moment(props.projection.Start).diff(
    Moment(props.person.Date),
    "m"
  );
  const length = props.projection.minutes;
  const color = props.projection.Color;

  const style = {
    position: "absolute",
    left: start - 480 + "px",
    width: length + "px",
    height: "40px",
    backgroundColor: color
  };
  return <div style={style}>&nbsp;</div>;
};

export default Bar;
//   [{start}]
//   {props.projection.Description}
//   {Moment(props.projection.Start).format("LLL")}
//   {Moment.duration(props.projection.minutes, "minutes").humanize()}
