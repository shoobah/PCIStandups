import React, {Component} from 'react';
import Moment from 'moment';
import Scheme from './Scheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Slider from 'material-ui/Slider';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import './App.css';

Moment.locale('sv');

class App extends Component {
    constructor(props) {
        super(props);
        this.availableCount = 0;
        this.meetingLength = 15;
        this.startTime = new Moment(props.startTime);
        this.data = [];
        this.state = {
            searchTime: this.startTime,
            currentFree: 0,
            setValue: 0
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
        this.data.forEach((person, index) => {
            if (this.isAvailable(person, time)) count += 1;
        });
        this.setState({
            currentFree: count
        });
        return;
    };

    increaseTime = () => {
        const newTime = Moment(this.state.searchTime).add(15, 'minutes');
        this.availableCount = 0;
        this.setState({
            searchTime: newTime
        });
        this.checkAvilability(newTime);
        return;
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
        return;
    };

    resetAll = () => {
        this.startTime = new Moment(this.props.startTime);
        this.data = this.props.data.ScheduleResult.Schedules.filter(person => person.ContractTimeMinutes > 0);
        this.checkAvilability(this.startTime);
        this.setState({
            searchTime: this.startTime,
            setValue: 0
        });
    };

    changeTime(e, minutes) {
        const newTime = Moment(this.startTime).add(minutes, 'minutes');
        this.setState({
            searchTime: newTime
        });
        this.checkAvilability(newTime);
    }

    seekTime() {}

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <AppBar
                        title={`${this.state.searchTime.format('LLL')} - ${this.state.currentFree} lediga.`}
                        showMenuIconButton={false}
                    />
                    <Toolbar>
                        <ToolbarGroup firstChild>
                            <RaisedButton label="Reset" onTouchTap={this.resetAll.bind(this)} />
                            <RaisedButton label="Nästa lämpliga tid" onTouchTap={this.seekTime.bind(this)} primary />
                            <RaisedButton label="Boka rum" />
                            <RaisedButton label="Välj team" />
                        </ToolbarGroup>
                    </Toolbar>

                    <div className="Controls">
                        <Slider
                            defaultValue={0}
                            min={0}
                            max={705}
                            step={15}
                            value={this.state.setValue}
                            onChange={this.changeTime.bind(this)}
                        />
                    </div>
                    <ul className="MainList">
                        {this.data.map(
                            (person, i) =>
                                person.ContractTimeMinutes > 0
                                    ? <Scheme
                                          isAvailable={this.isAvailable(person, this.state.searchTime)}
                                          person={person}
                                          key={`scheme-${i}`}
                                          index={i}
                                          searchTime={this.state.searchTime}
                                      />
                                    : null
                        )}
                    </ul>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
