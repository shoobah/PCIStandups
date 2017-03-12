import React from 'react';
import Moment from 'moment';

const Bar = props => {
    const start = Moment(props.projection.Start).diff(Moment(props.person.Date), 'm');
    const length = props.projection.minutes;
    const color = props.projection.Color;

    const style = {
        position: 'absolute',
        left: props.offset + start - 480 + 'px',
        width: length + 'px',
        height: '40px',
        backgroundColor: color,
        lineHeight: '40px',
        borderRadius: '5px'
    };
    return <div style={style}>{length > 30 ? props.projection.Description : ''}</div>;
};

export default Bar;
