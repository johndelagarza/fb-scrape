import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider, Table } from 'semantic-ui-react';
import { Header } from '../components/styled/elements';
import { clearLogs } from "../store/actions/action";

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Logs(props) {
    const [logs, setLogs] = useState([]);

    useEffect(()=> {
        return setLogs(props.status.logs);
    }, [props.status.logs]);
    
    return (
        <Container>
            <Header margin={"20px"}>Scrape Logs</Header>
            <Divider />
            <Button onClick={()=> props.clearLogs()}>Clear Logs</Button>
            <Table fixed basic='very'> 
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell>Event</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.status.logs.length === 0 ? null : props.status.logs.reverse().map((log)=> { 
                        return (
                            <Table.Row>                                       
                                <Table.Cell>{log.keyword}</Table.Cell>
                                <Table.Cell>{log.message}</Table.Cell>
                                <Table.Cell>{moment.unix(log.time).format('MMMM Do YYYY, h:mm:ss a').toString()}</Table.Cell>
                            </Table.Row>
                            );                                 
                        })
                    }                      
                </Table.Body>
            </Table>
        </Container>
    )
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        clearLogs: () => dispatch(clearLogs())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);