import React, { useState, useEffect } from 'react'
import { Container, Modal, Button, Input } from 'semantic-ui-react';

const queryString = require('query-string');

function AddKeyword(props) {
    const [open, setModal] = useState(false);
    const [url, setUrl] = useState(null);
    
    const addUrl = async (url) => {
        const parsed = queryString.parse(url);
        console.log(parsed)
        if (!parsed.maxPrice) return alert('Error: URL must include max price filter.');
        if (!parsed.query) return alert('Error: URL is missing a keyword.');
        //if (parsed.sortBy !== 'creation_time_descend') return alert('Error: URL must include creation_time_descend filter.');
        let currentUrls = localStorage.getItem('keywords');
       
        if (!currentUrls) {
            let newKeywords = [{keyword: parsed.query, url: url, online: false}];
            localStorage.setItem('keywords', JSON.stringify(newKeywords));
            return props.saveKeywords(newKeywords);
        } else if (currentUrls.length > 0) {
            currentUrls = JSON.parse(currentUrls);
            console.log(currentUrls);
            let doesKeywordAlreadyExist = currentUrls.filter(url => url.keyword === parsed.query);
            if (doesKeywordAlreadyExist.length > 0) return alert('Keyword already saved.')
            let newKeywords = [...currentUrls, {keyword: parsed.query, url: url, online: false}];
            localStorage.setItem('keywords', JSON.stringify(newKeywords));
            return props.saveKeywords(newKeywords);
        }
    };

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
                    addUrl(url)
                        //.then(()=> props.refreshKeywords())
                }}>Add URL</Button>
        </Container>
        </Modal.Content>
    </Modal>
    );
};
        
export default AddKeyword;
