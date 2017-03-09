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
        this.meetingLength = 15;
        this.startTime = new Moment('2015-12-14T09:00');
        this.data = [];
        this.state = {
            searchTime: this.startTime,
            currentFree: 0
        };
    }

    componentWillMount() {
        this.data = this.props.data.ScheduleResult.Schedules.filter(person => person.ContractTimeMinutes > 0);
        this.checkAvilability(this.startTime);
    }

    //Hämta aktivitet för en viss tid
    getActivity = (projection, time, inclusion = '[)') => {
        const m = time;
        const activeProj = projection.filter(val => {
            const t1 = Moment(val.Start);
            const t2 = Moment(t1).add(val.minutes, 'minutes');
            const between = m.isBetween(t1, t2, 'seconds', inclusion);
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
        const act1 = this.getActivity(person.Projection, time);
        const act2 = this.getActivity(person.Projection, Moment(time).add(this.meetingLength, 'minutes'), '[]');
        return this.isAnAvilableActivity(act1) && this.isAnAvilableActivity(act2);
    };

    checkAvilability = time => {
        let count = 0;
        this.data.map((person, index) => {
            if (this.isAvailable(person, time)) count += 1;
        });
        this.setState({
            currentFree: count
        });
    };

    increaseTime = () => {
        const newTime = Moment(this.state.searchTime).add(15, 'minutes');
        this.availableCount = 0;
        this.setState({
            searchTime: newTime
        });
        this.checkAvilability(newTime);
    };

    decreaseTime = () => {
        const newTime = Moment(this.state.searchTime).subtract(15, 'minutes');
        if (newTime.isSameOrAfter(this.startTime)) {
            this.availableCount = 0;
            this.setState({
                searchTime: newTime
            });
            this.checkAvilability(newTime);
        }
    };

    render() {
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
                <div>{this.state.currentFree}</div>
                <ul className="MainList">
                    {this.data.map(
                        (person, i) => person.ContractTimeMinutes > 0
                            ? <Scheme
                                  isAvailable={this.isAvailable(person, this.state.searchTime)}
                                  person={person}
                                  key={`scheme-${i}`}
                                  index={i}
                                  searchTime={this.state.searchTime}
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
