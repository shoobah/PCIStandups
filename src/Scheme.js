import React from 'react';
import Moment from 'moment';
import Marker from './Marker';
import Bar from './Bar';

const Scheme = props => {
    const start = props.searchTime.diff(Moment(props.person.Date), 'm');
    const offset = 200;
    let style = {
        backgroundColor: 'rgba(124, 252, 0, 1)',
        color: 'black',
        width: '150px',
        textAlign: 'left',
        paddingLeft: '10px'
    };
    if (!props.isAvailable) {
        style = {
            backgroundColor: 'rgba(255, 69, 0, 1)',
            color: 'rgba(128, 35, 0, 1)',
            width: '150px',
            textAlign: 'left',
            paddingLeft: '10px'
        };
    }
    return (
        <div className="Scheme" style={{top: props.index * 50 + 'px'}}>
            <span className="SchemeLabel" style={style}>{props.person.Name}</span>
            {props.person.Projection.map((projection, index) => (
                <Bar
                    key={`projection-${props.person.Name}-${index}`}
                    projection={projection}
                    person={props.person}
                    index={index}
                    offset={offset}
                />
            ))}
            <Marker start={start} isAvailable={props.isAvailable} offset={offset} />
        </div>
    );
};

export default Scheme;
