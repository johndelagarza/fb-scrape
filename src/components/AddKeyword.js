import React, { useState, useEffect } from 'react'
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Confirm, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
const queryString = require('query-string');

function AddKeyword(props) {
    const [open, setModal] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [url, setUrl] = useState(null);

    return (
        <Modal closeIcon onClose={()=> setModal(false)} open={open} size="small" trigger={
                <Button onClick={()=> setModal(true)}>
                    Add Keyword
                </Button>
            }
        >
        <Modal.Header>Add New Keyword</Modal.Header>
        <Modal.Content>
            <Container style={{padding:"50px", width:"800px"}}>
                <Input 
                    label="URL"
                    fluid 
                    placeholder="Url to scrape."
                    onChange={(e)=> setUrl(e.target.value)}
                /> <br/>
            <Button fluid onClick={()=> {
                    setModal(false);
                    addUrl(url).then(()=> props.refreshKeywords())
                }}>Add URL</Button>
        </Container>
        </Modal.Content>
    </Modal>
    );
};

const addUrl = async (url) => {
    const parsed = queryString.parse(url);
    console.log(parsed)
    let currentUrls = localStorage.getItem('keywords');
   
    if (!currentUrls) {
        let newKeywords = [{keyword: parsed.query, url: url, online: false}];
        return localStorage.setItem('keywords', JSON.stringify(newKeywords));
    } else if (currentUrls.length > 0) {
        currentUrls = JSON.parse(currentUrls);
        console.log(currentUrls);
        let doesKeywordAlreadyExist = currentUrls.filter(url => url.keyword === parsed.query);
        if (doesKeywordAlreadyExist.length > 0) return alert('Keyword already saved.')
        let newKeywords = [...currentUrls, {keyword: parsed.query, url: url, online: false}];
        return localStorage.setItem('keywords', JSON.stringify(newKeywords));
    }
};

        
export default AddKeyword;
