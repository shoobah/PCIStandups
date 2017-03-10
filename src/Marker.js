import React from 'react';

const Marker = props => {
    return (
        <div
            style={{
                position: 'absolute',
                left: props.offset + props.start - 480 + 'px',
                width: '15px',
                height: '40px',
                backgroundColor: props.isAvailable ? 'rgba(124, 252, 0, 0.652)' : 'rgba(255, 69, 0, 0.695)',
                zIndex: 1000,
                outline: 'solid 1px black'
            }}
        />
    );
};

export default Marker;
