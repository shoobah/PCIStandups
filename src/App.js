import React, {Component} from 'react';
import Moment from 'moment';
import Scheme from './Scheme';
import Bar from './Bar';
import './App.css';

Moment.locale('sv');

class App extends Component {
    constructor(props) {
        super(props);
        this.availableCount = 0;
        this.startTime = new Moment('2015-12-14T09:00');
        this.state = {
            searchTime: this.startTime
        };
    }
    //Hämta aktivitet för en viss tid
    getActivity = (projection, time) => {
        const m = time;
        const activeProj = projection.filter(val => {
            const t1 = Moment(val.Start);
            const t2 = Moment(t1).add(val.minutes, 'minutes');
            const between = m.isBetween(t1, t2, 'seconds', '[)');
            return between;
        })[0];
        return activeProj && activeProj.Description ? activeProj.Description : null;
    };

    //Kolla om aktiviteten är en tillgänglig aktivitet
    isAnAvilableActivity(activity) {
        if (activity === null || activity === 'Lunch' || activity === 'Short break') return false;
        return true;
    }

    //Kolla om en person är tillgänglig vid en viss tid
    isAvailable = (person, time) => {
        const act = this.getActivity(person.Projection, time);
        return this.isAnAvilableActivity(act);
    };

    addAvaliability = () => {
        this.availableCount += 1;
    };

    increaseTime = () => {
        const newTime = this.state.searchTime.add(15, 'minutes');
        this.availableCount = 0;
        this.setState({
            searchTime: newTime
        });
    };

    decreaseTime = () => {
        const newTime = this.state.searchTime.subtract(15, 'minutes');
        this.availableCount = 0;
        this.setState({
            searchTime: newTime
        });
    };

    render() {
        const data = this.props.data.ScheduleResult.Schedules.filter(person => person.ContractTimeMinutes > 0);
        console.log('this.state.searchTime', this.state.searchTime.format('LLL'));

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Welcome to Pizza Cabin Inc. Stand-up scheduler</h2>
                    <h3>{this.state.searchTime.format('LLL')}</h3>
                </div>
                <div className="Controls">
                    <span className="Clickable" onClick={this.decreaseTime.bind(this)}>«</span>
                    <span className="Clickable" onClick={this.increaseTime.bind(this)}>»</span>
                </div>
                <ul className="MainList">
                    {data.map(
                        (person, i) => person.ContractTimeMinutes > 0
                            ? <Scheme
                                  isAvailable={this.isAvailable(person, this.state.searchTime)}
                                  person={person}
                                  key={`scheme-${i}`}
                                  index={i}
                                  searchTime={this.state.searchTime.format('LLL')}
                                  adder={this.addAvaliability}
                              >
                                  {person.Projection.map((projection, index) => (
                                      <Bar
                                          key={`projection-${i}-${index}`}
                                          projection={projection}
                                          person={person}
                                          index={index}
                                      />
                                  ))}
                              </Scheme>
                            : null
                    )}
                </ul>
            </div>
        );
    }
}

export default App;
