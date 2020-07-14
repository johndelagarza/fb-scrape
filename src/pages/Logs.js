import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider, Message, Segment } from 'semantic-ui-react';
import { Header } from '../components/styled/elements';

const ipcRenderer = window.require('electron').ipcRenderer;

function Logs() {
    const [logs, setLogs] = useState(null);

    useEffect(()=> {
        getLogs().then(data => setLogs(data));
    }, []);
    
    return (
        <Container>
            <Header margin={"20px"}>Scrape Logs</Header>
            <Divider />
            <Segment>
                
            </Segment>
        </Container>
    )
};

const getLogs = async () => {
    const logs = await ipcRenderer.invoke('get-logs');
    return logs;
};

export default Logs


{/* <Message color="red">
                {!logs ? null : logs.split(" ..").slice(0).reverse().map(log => {
                    let d = log.split(/\[(.*?)\]/)
                return <p>{d[1]}
                            <p style={{color: 'black', display: 'inline'}}>{d[2]}</p>
                        </p>
                })}
            </Message> */}