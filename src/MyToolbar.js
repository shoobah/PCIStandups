import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

const MyToolbar = props => {
    return (
        <Toolbar>
            <ToolbarGroup firstChild>
                <RaisedButton label="Reset" onTouchTap={props.resetAll.bind(this)} />
                <RaisedButton label="Föreg. lämpliga tid" onTouchTap={props.prevPossibleTime.bind(this)} primary />
                <RaisedButton label="Nästa lämpliga tid" onTouchTap={props.nextPossibleTime.bind(this)} primary />
                <TextField
                    style={{width: '100px'}}
                    hintText={'Minst antal deltagare'}
                    errorText={props.errorMessage}
                    onChange={props.filterOnNumber.bind(this)}
                    value={props.minParticipants}
                />
                <Slider
                    defaultValue={0}
                    min={0}
                    max={705}
                    step={15}
                    style={{width: '300px', paddingTop: '23px'}}
                    value={props.setValue}
                    onChange={props.changeTime.bind(this)}
                />
                <span style={{paddingLeft: '20px'}}>{props.searchTime.format('LT')}</span>
            </ToolbarGroup>
        </Toolbar>
    );
};

export default MyToolbar;
