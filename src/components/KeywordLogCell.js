import React, { useState, useEffect } from 'react'
import { Table} from 'semantic-ui-react';

const { ipcRenderer } = window.require('electron');

function KeywordLogCell(props) {
    const [log, setLog] = useState(null);

    useEffect(()=> {
        ipcRenderer.on(props.keyword, (event, msg)=> {
            return setLog(msg.message);
        });
    }, [log]);
    
    return (
        <Table.Cell style={{paddingLeft: "90px", paddingRight: "90px", position:"fixed" }}>
        {!props.active ? 'Stopped' 
            : log ? log
            : ''
        }
        </Table.Cell>                
    )
};

export default KeywordLogCell