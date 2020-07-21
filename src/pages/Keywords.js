import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';

import { Container, Table, Divider} from 'semantic-ui-react';
import { Header } from '../components/styled/elements';
import AddKeyword from '../components/AddKeyword';
import DeleteKeyword from '../components/DeleteKeyword';
import StartKeyword from '../components/StartKeyword';
import StopKeyword from '../components/StopKeyword';
import KeywordLogCell from '../components/KeywordLogCell';

import { updateKeywords } from "../store/actions/action";

function Keywords(props) {
    const [keywords, setKeywords] = useState(props.status.keywords);

    useEffect(()=> {
        return setKeywords(keywords);
    }, []);
    
    console.log(props.status)
    return (
        <Container>
            <h1>{}</h1>
            <Header margin={"20px"}>Current Keywords</Header>
            <Divider />
            <AddKeyword saveKeywords={props.updateKeywords}/>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell style={{paddingLeft: "90px", paddingRight: "90px"}}>Log</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right' style={{paddingRight: "60px"}}>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.status.keywords.length === 0 ? null : props.status.keywords.map((keyword)=> { 
                        return (
                            <Table.Row>                                       
                                <Table.Cell>{keyword.keyword.toUpperCase()}</Table.Cell>
                                <KeywordLogCell keyword={keyword.keyword} active={keyword.online} />
                                <Table.Cell textAlign='right'>
                                    <StartKeyword 
                                        keyword={keyword} 
                                        saveKeywords={props.updateKeywords}
                                    />
                                    <StopKeyword 
                                        keyword={keyword} 
                                        saveKeywords={props.updateKeywords}
                                    />
                                    <DeleteKeyword 
                                        keyword={keyword.keyword} 
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

const getKeywords = async () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        return JSON.parse(keywords);
    };
};