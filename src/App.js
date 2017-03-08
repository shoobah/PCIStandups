import React, {Component} from "react";
import Moment from "moment";
import Scheme from "./Scheme";
import Bar from "./Bar";
import "./App.css";

Moment.locale("sv");

class App extends Component {
  constructor(props) {
    super(props);
    this.availableCount = 0;
  }
  //Hämta aktivitet för en viss tid
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

  //Kolla om aktiviteten är en tillgänglig aktivitet
  isAnAvilableActivity(activity) {
    if (activity === null || activity === "Lunch" || activity === "Short break")
      return false;
    return true;
  }

  //Kolla om en person är tillgänglig vid en viss tid
  isAvailable = (person, time) => {
    const act = this.getActivity(person.Projection, time);
    return this.isAnAvilableActivity(act);
  };

  addAvaliability = () => {
    this.availableCount += 1;
    console.log("this.availableCount", this.availableCount);
  };

  render() {
    const data = this.props.data.ScheduleResult.Schedules.filter(
      person => person.ContractTimeMinutes > 0
    );
    const searchTime = "2015-12-14 14:15";
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Pizza Cabin Inc. Stand-up scheduler</h2>
          <h3>{searchTime}</h3>
        </div>
        <ul className="MainList">
          {data.map(
            (person, i) => person.ContractTimeMinutes > 0
              ? <Scheme
                  isAvailable={this.isAvailable(person, searchTime)}
                  person={person}
                  key={`scheme-${i}`}
                  index={i}
                  searchTime={searchTime}
                  adder={this.addAvaliability}
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
