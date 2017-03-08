import React, {Component} from "react";
import logo from "./logo.svg";
import Moment from "moment";
import Scheme from "./Scheme";
import Bar from "./Bar";
import "./App.css";

Moment.locale("sv");

class App extends Component {
  getActivity = (projection, time) => {
    const m = Moment(time);
    const activeProj = projection.filter(val => {
      const t1 = Moment(val.Start);
      const t2 = Moment(t1).add(val.minutes, "minutes");
      const between = m.isBetween(t1, t2, "seconds", "[)");
      return between;
    })[0];
    return activeProj && activeProj.Description ? activeProj.Description : null;
  };

  isAnAvilableActivity(activity) {
    if (activity && (activity !== "Lunch" || activity !== "Short break"))
      return true;

    return false;
  }

  isAvailable = (person, time) => {
    const act = this.getActivity(person.Projection, time);
    console.log("person.Name", person.Name);

    console.log("act", this.isAnAvilableActivity(act));
    return this.isAnAvilableActivity(act);
  };

  render() {
    const data = this.props.data.ScheduleResult.Schedules.filter(
      person => person.ContractTimeMinutes > 0
    );
    const searchTime = "2015-12-14 11:45";
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Pizza Cabin Inc. Stand-up scheduler</h2>
          <h3>{searchTime}</h3>
        </div>
        <ul style={{listStyle: "none", position: "relative"}}>
          {data.map(
            (person, i) => person.ContractTimeMinutes > 0
              ? <Scheme
                  isAvailable={this.isAvailable(person, searchTime)}
                  person={person}
                  key={`scheme-${i}`}
                  index={i}
                >
                  {person.Projection.map((projection, index) => 
                    <Bar
                        key={`projection-${i}-${index}`}
                        projection={projection}
                        person={person}
                        index={index}
                    />
                  )}
                </Scheme>
              : null
          )}
        </ul>
      </div>
    );
  }
}

export default App;
