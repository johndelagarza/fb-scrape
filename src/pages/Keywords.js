import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';

import { Container, Table, Divider, Header } from 'semantic-ui-react';
import AddKeyword from '../components/AddKeyword';
import DeleteKeyword from '../components/DeleteKeyword';
import StartKeyword from '../components/StartKeyword';
import StopKeyword from '../components/StopKeyword';
import KeywordLogCell from '../components/KeywordLogCell';
import { updateKeywords } from "../store/actions/action";

const { ipcRenderer } = window.require('electron');

function Keywords(props) {
    const [keywords, setKeywords] = useState(props.status.keywords);

    useEffect(()=> {
        return setKeywords(keywords);
    }, []);
    
    return (
        <Container>
            <h2 className="page-header" margin={"20px"}>Current Keywords</h2>
            <Divider />
            <AddKeyword saveKeywords={props.updateKeywords}/>
            <Table fixed unstackable size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell>Log</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right' style={{paddingRight: "60px"}}>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.status.keywords.length === 0 ? null : props.status.keywords.map((keyword)=> { 
                        return (
                            <Table.Row key={keyword.keyword}>                                       
                                <Table.Cell>{keyword.keyword.toUpperCase()}</Table.Cell>
                                <KeywordLogCell keyword={keyword.keyword} active={keyword.online} />
                                
                                <Table.Cell textAlign='right'>
                                    <StartKeyword 
                                        keyword={keyword} 
                                        
                                    />
                                    <StopKeyword 
                                        keyword={keyword} 
                                        saveKeywords={props.updateKeywords}
                                    />
                                    <DeleteKeyword 
                                        keyword={keyword} 
                                        saveKeywords={props.updateKeywords}
                                    />
                                </Table.Cell>
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
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Keywords);