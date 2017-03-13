import React, {Component} from 'react';
import Moment from 'moment';
import Scheme from './Scheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MyToolbar from './MyToolbar';
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
        this.data = [];
        this.state = {
            searchTime: this.startTime,
            minParticipants: 0,
            currentFree: 0,
            setValue: 0,
            errorMessage: ''
        };
    }

    componentWillMount() {
        this.data = this.props.data.ScheduleResult.Schedules.filter(person => person.ContractTimeMinutes > 0);
        this.setState({
            minParticipants: this.data.length
        });
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
            minParticipants: this.data.length,
            currentFree: 0,
            setValue: 0,
            errorMessage: ''
        });
        this.seekTime(this.state.minParticipants);
    };

    changeTime(e, minutes) {
        const newTime = Moment(this.startTime).add(minutes, 'minutes');
        this.setState({
            searchTime: newTime
        });
        this.checkAvilability(newTime);
    }

    seekTime(minParticipants) {
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
            if (a.time.isSameOrBefore(b.time)) return -1;
            if (a.time.isAfter(b.time)) return 1;
            return 0;
        });
        this.possibleTimes = this.possibleTimes.filter(value => value.count >= minParticipants);
        this.currentPossible = 0;
    }

    nextPossibleTime() {
        this.setState({
            searchTime: this.possibleTimes[this.currentPossible].time,
            currentFree: this.possibleTimes[this.currentPossible].count,
            setValue: this.possibleTimes[this.currentPossible].time.diff(this.startTime, 'minutes')
        });
        this.currentPossible += 1;
        if (this.currentPossible >= this.possibleTimes.length) this.currentPossible = 0;
    }

    prevPossibleTime() {
        this.setState({
            searchTime: this.possibleTimes[this.currentPossible].time,
            currentFree: this.possibleTimes[this.currentPossible].count,
            setValue: this.possibleTimes[this.currentPossible].time.diff(this.startTime, 'minutes')
        });
        this.currentPossible -= 1;
        if (this.currentPossible < 0) this.currentPossible = this.possibleTimes.length - 1;
    }

    filterOnNumber(e, val) {
        this.setState({
            minParticipants: e.target.value
        });
        if (!val) {
            this.setState({
                errorMessage: ''
            });
            return;
        }
        let n = parseInt(val, 10);
        if (isNaN(n)) {
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
        this.seekTime(n);
        if (this.possibleTimes && this.possibleTimes.length > 0) {
            this.setState({
                minParticipants: n,
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
                    <MyToolbar
                        minParticipants={this.state.minParticipants}
                        errorMessage={this.state.errorMessage}
                        prevPossibleTime={this.prevPossibleTime}
                        nextPossibleTime={this.nextPossibleTime}
                        changeTime={this.changeTime}
                        filterOnNumber={this.filterOnNumber}
                        resetAll={this.resetAll}
                    />

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
