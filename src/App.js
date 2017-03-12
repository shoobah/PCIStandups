import React, {Component} from 'react';
import Moment from 'moment';
import Scheme from './Scheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
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
        this.possibleTimes = [];
        this.currentPossible = 0;
        this.minParticipants = 0;
        this.data = [];
        this.state = {
            searchTime: this.startTime,
            currentFree: 0,
            setValue: 0,
            errorMessage: ''
        };
    }

    componentWillMount() {
        this.data = this.props.data.ScheduleResult.Schedules.filter(person => person.ContractTimeMinutes > 0);
        this.minParticipants = this.data.length;
        this.checkAvilability(this.startTime);
        this.seekTime();
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
        return count;
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

    seekTime() {
        const startAt = Moment(this.startTime);
        let offset = 0;
        const step = 15;
        this.possibleTimes = [];
        while (offset <= 700) {
            const time = Moment(startAt).add(offset, 'minutes');
            offset += step;
            let info = {
                time,
                count: this.checkAvilability(time)
            };
            this.possibleTimes.push(info);
        }
        this.possibleTimes.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            if (a.count === b.count && a.time.isSameOrBefore(b.time)) return -1;
            if (a.count === b.count && a.time.isAfter(b.time)) return 1;
            return 0;
        });
        this.possibleTimes = this.possibleTimes.filter(value => value.count >= this.minParticipants);
        console.log('this.possibleTimes', this.possibleTimes);

        this.currentPossible = 0;
    }

    nextPossibleTime() {
        this.setState({
            searchTime: this.possibleTimes[this.currentPossible].time,
            currentFree: this.possibleTimes[this.currentPossible].count
        });
        this.currentPossible += 1;
        if (this.currentPossible >= this.possibleTimes.length) this.currentPossible = 0;
    }

    prevPossibleTime() {
        this.setState({
            searchTime: this.possibleTimes[this.currentPossible].time,
            currentFree: this.possibleTimes[this.currentPossible].count
        });
        this.currentPossible -= 1;
        if (this.currentPossible < 0) this.currentPossible = this.possibleTimes.length - 1;
    }

    filterOnNumber(e, val) {
        if (!val) {
            this.setState({
                errorMessage: ''
            });
            return;
        }
        let n = parseInt(val, 10);
        if (!n || n < 0) {
            this.setState({
                errorMessage: 'Inte ett tal!'
            });
            return;
        }
        if (n > this.data.length) {
            this.setState({
                errorMessage: 'För många deltagare max ' + this.data.length
            });
            return;
        }
        this.setState({
            errorMessage: ''
        });
        this.minParticipants = n;
        this.seekTime();
        if (this.possibleTimes && this.possibleTimes.length > 0) {
            this.setState({
                searchTime: this.possibleTimes[0].time,
                currentFree: this.possibleTimes[0].count
            });
        }
    }

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
                            <RaisedButton
                                label="Föreg. lämpliga tid"
                                onTouchTap={this.prevPossibleTime.bind(this)}
                                primary
                            />
                            <RaisedButton
                                label="Nästa lämpliga tid"
                                onTouchTap={this.nextPossibleTime.bind(this)}
                                primary
                            />
                            <TextField
                                hintText={'Minst antal deltagare'}
                                errorText={this.state.errorMessage}
                                onChange={this.filterOnNumber.bind(this)}
                            />
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
