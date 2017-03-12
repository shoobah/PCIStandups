import React from 'react';

const Marker = props => {
    if (props.isAvailable)
        return (
            <div
                style={{
                    position: 'absolute',
                    left: props.offset + props.start - 480 + 'px',
                    width: '13px',
                    height: '38px',
                    backgroundColor: props.isAvailable ? 'rgba(124, 252, 0, 0.652)' : 'rgba(255, 69, 0, 0.695)',
                    zIndex: 1000,
                    boxShadow: '0 0 10px #333',
                    borderRadius: '5px'
                }}
            />
        );
    return null;
};

export default Marker;
