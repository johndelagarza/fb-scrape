import React, { useState, useEffect } from 'react'
import { Container, Table, Divider} from 'semantic-ui-react';
import { Header } from '../components/styled/elements';
import AddKeyword from '../components/AddKeyword';
import DeleteKeyword from '../components/DeleteKeyword';
import StartKeyword from '../components/StartKeyword';
import StopKeyword from '../components/StopKeyword';
import KeywordLogCell from '../components/KeywordLogCell';

function Keywords() {
    const [keywords, setKeywords] = useState([]);

    useEffect(()=> {
        getKeywords().then(keywords => {
            return setKeywords(keywords);
        })
    }, []);

    return (
        <Container>
            <h1>{}</h1>
            <Header margin={"20px"}>Current Keywords</Header>
            <Divider />
            <AddKeyword refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}/>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell style={{paddingLeft: "90px", paddingRight: "90px"}}>Log</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right' style={{paddingRight: "60px"}}>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {keywords.length === 0 ? null : keywords.map((keyword)=> { 
                        return (
                            <Table.Row>                                       
                                <Table.Cell>{keyword.keyword.toUpperCase()}</Table.Cell>
                                <KeywordLogCell keyword={keyword.keyword} active={keyword.online} />
                                <Table.Cell textAlign='right'>
                                    <StartKeyword 
                                        keyword={keyword} 
                                        refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
                                    />
                                    <StopKeyword 
                                        keyword={keyword} 
                                        refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
                                    />
                                    <DeleteKeyword 
                                        keyword={keyword.keyword} 
                                        refreshKeywords={()=> getKeywords().then(keywords => setKeywords(keywords))}
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

export default Keywords

const getKeywords = async () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        return JSON.parse(keywords);
    };
};