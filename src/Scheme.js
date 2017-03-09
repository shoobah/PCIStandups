import React, {Component} from 'react';
import Moment from 'moment';

class Scheme extends Component {
    render() {
        const start = this.props.searchTime.diff(Moment(this.props.person.Date), 'm');
        return (
            <div className="Scheme" style={{top: this.props.index * 50 + 'px'}}>
                {this.props.children}
                <div
                    style={{
                        position: 'absolute',
                        left: start - 481 + 'px',
                        width: '15px',
                        height: '40px',
                        backgroundColor: this.props.isAvailable ? 'lime' : 'red',
                        zIndex: 1000
                    }}
                />
            </div>
        );
    }
}

export default Scheme;
