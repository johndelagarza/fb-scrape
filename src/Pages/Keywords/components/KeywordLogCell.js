import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Countdown from 'react-countdown';
import { addLog } from "../../../store/actions/";

const { ipcRenderer } = window.require('electron');

function KeywordLogCell({ keyword, active, addLog, settings }) {
    const [log, setLog] = useState(null);

    useEffect(()=> {
        ipcRenderer.removeAllListeners(keyword.id)
        ipcRenderer.on(keyword.id, (event, msg)=> {
            
            addLog(msg)
            return setLog(msg.message);
        });

        return function cleanup() {
            ipcRenderer.removeAllListeners(keyword.id)
        }
    }, []);
    
    return (
        <span className="flex justify-left pointer-events-none text-xs whitespace-nowrap text-ellipsis overflow-hidden">
            {/* <Countdown date={keyword.lastActive + settings.interval} /> */}
            {
                !active ? 'Stopped' 
                : log && log !== "Returning listings." ? log
                : <span>Waiting: <Countdown date={keyword.lastActive + settings.interval} /></span>
            }
        </span>           
    )
};

const mapStateToProps = state => {
    return { logs: state.logs, settings: state.settings }
};

const mapDispatchToProps = dispatch => {
    return {
        addLog: (log) => dispatch(addLog(log))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordLogCell)