import React from 'react';
import Scheme from './Scheme';

const Diagram = props => {
    return (
        <ul className="MainList">
            {props.data.map(
                (person, i) =>
                    person.ContractTimeMinutes > 0
                        ? <Scheme
                              isAvailable={props.isAvailable(person, props.searchTime)}
                              person={person}
                              key={`scheme-${i}`}
                              index={i}
                              searchTime={props.searchTime}
                          />
                        : null
            )}
        </ul>
    );
};

export default Diagram;
