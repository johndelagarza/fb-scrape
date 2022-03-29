import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table} from 'semantic-ui-react';
import { addLog } from "../store/actions/action";

const { ipcRenderer } = window.require('electron');

function KeywordLogCell(props) {
    const [log, setLog] = useState(null);

    useEffect(()=> {
        ipcRenderer.removeAllListeners(props.keyword)
        ipcRenderer.on(props.keyword, (event, msg)=> {
            console.log('received');
            props.addLog(msg)
            return setLog(msg.message);
        });
        return function cleanup() {
            ipcRenderer.removeAllListeners(props.keyword)
        }
    }, []);
    
    return (
        <Table.Cell >
        {!props.active ? 'Stopped' 
            : log ? log
            : 'Waiting...'
        }
        </Table.Cell>                
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