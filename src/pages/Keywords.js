import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Checkbox, Input, Menu, Table, Modal, Portal, Button, Dropdown, Search, Segment, Icon, Divider} from 'semantic-ui-react';
import { Header } from '../components/styled/elements';
import AddKeyword from '../components/AddKeyword';
import DeleteKeyword from '../components/DeleteKeyword';
import StartKeyword from '../components/StartKeyword';
import StopKeyword from '../components/StopKeyword';

function Keywords() {
    const [keywords, setKeywords] = useState([]);

    useEffect(()=> {
        getKeywords().then(keywords => setKeywords(keywords));
    }, []);

    return (
        <Container>
            <Header margin={"20px"}>Current Keywords</Header>
            <Divider />
            <AddKeyword refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}/>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">Status</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {keywords.length === 0 ? null : keywords.map((keyword)=> { 
                        return (
                            <Table.Row>                                       
                                <Table.Cell>{keyword.keyword.toUpperCase()}</Table.Cell>
                                <Table.Cell textAlign="right">{keyword.online ? 'Online' : 'Offline'}</Table.Cell>
                                <Table.Cell collapsing>
                                    {
                                        keyword.online ?
                                        <StopKeyword 
                                            keyword={keyword} 
                                            refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
                                        />
                                    : 
                                        <StartKeyword 
                                            keyword={keyword} 
                                            refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
                                        />
                                    }
                                    <DeleteKeyword 
                                        keyword={keyword.keyword} 
                                        refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
                                    />
                                    {/* <Button icon="close icon" onClick={()=>{this.deleteUser(user.discordId)}}/>                                */}
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

export default Keywords

const getKeywords = async () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        return JSON.parse(keywords);
    };
};