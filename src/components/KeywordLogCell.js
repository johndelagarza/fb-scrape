import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addLog } from "../store/actions/action";

const { ipcRenderer } = window.require('electron');

function KeywordLogCell(props) {
    const [log, setLog] = useState(null);

    useEffect(()=> {
        ipcRenderer.removeAllListeners(props.keyword.id)
        ipcRenderer.on(props.keyword.id, (event, msg)=> {
            //props.addLog(msg)
            return setLog(msg.message);
        });
        return function cleanup() {
            ipcRenderer.removeAllListeners(props.keyword.id)
        }
    }, []);
    
    return (
        <span class="flex justify-left pointer-events-none text-xs whitespace-nowrap text-ellipsis overflow-hidden">
            {
                !props.active ? 
                    'Stopped' 
                : log ? 
                    log
                : 'Waiting...'
            }
        </span>           
    )
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        addLog: (log) => dispatch(addLog(log))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordLogCell)