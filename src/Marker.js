import React from 'react';

const Marker = props => {
    if (props.isAvailable)
        return (
            <div
                style={{
                    position: 'absolute',
                    left: props.offset + props.start - 480 + 'px',
                    top: '12px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: 'rgb(0, 188, 212)',
                    zIndex: 1000,
                    boxShadow: '0 0 10px #333',
                    borderRadius: '50%'
                }}
            />
        );
    return null;
};

export default Marker;
