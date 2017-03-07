import React from "react";
import Moment from "moment";

const Bar = props => {
  const start = Moment(props.proj.Start).diff(Moment(props.person.Date), "m");
  const length = props.proj.minutes;
  const color = props.proj.Color;

  const style = {
    position: "relative",
    left: start - 480 + "px",
    width: length + "px",
    backgroundColor: color
  };
  return (
    <div style={style}>
      [{start}]
      {props.proj.Description}
      {Moment(props.proj.Start).format("LTS")}
      {Moment.duration(props.proj.minutes, "minutes").humanize()}
    </div>
  );
};

export default Bar;
