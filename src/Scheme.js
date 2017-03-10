import React from 'react';
import Moment from 'moment';
import Marker from './Marker';
import Bar from './Bar';

const Scheme = props => {
    const start = props.searchTime.diff(Moment(props.person.Date), 'm');
    const offset = 200;
    return (
        <div className="Scheme" style={{top: props.index * 50 + 'px'}}>
            <span className="SchemeLabel">{props.person.Name}</span>
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
