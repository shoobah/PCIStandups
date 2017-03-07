import React, {Component} from "react";
import logo from "./logo.svg";
import Moment from "moment";
import Bar from "./Bar";
import "./App.css";

Moment.locale("sv");

class App extends Component {
  render() {
    console.log("this.props.data", this.props.data);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Pizza Cabin Inc. Stand-up scheduler</h2>
        </div>
        <ul style={{listStyle: "none"}}>
          {this.props.data.ScheduleResult.Schedules.map((item, i) => 
            <li style={{fontWeight: "700"}} key={`item-${i}`}>
              {item.Name} ({Moment(item.Date).format("LLLL")})
              <ul style={{listStyle: "none"}}>
                {item.Projection.map((proj, index) => 
                  <li style={{fontWeight: "100"}} key={`proj-${i}-${index}`}>
                    <Bar proj={proj} person={item} />
                  </li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
