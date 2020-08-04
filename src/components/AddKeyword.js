import React, { useState, useEffect } from 'react'
import { Container, Modal, Button, Input } from 'semantic-ui-react';

const queryString = require('query-string');

function AddKeyword(props) {
    const [open, setModal] = useState(false);
    const [url, setUrl] = useState(null);
    
    const addUrl = async (url) => {
        let config = { platform: '', keyword: '' };
        const parsed = await queryString.parse(url);
    
        url.includes('facebook.com') ? config = { keyword: parsed.query, platform: 'facebook' }  : 
        url.includes('ebay.com') ? config = { keyword: parsed._nkw, platform: 'ebay' } : alert('Error: Keyword not supported.')
        
        switch (config.keyword) {
            case 'facebook':
                if (!parsed.query) return alert('Error: URL is missing a keyword.');
                if (!parsed.maxPrice) return alert('Error: URL must include max price filter.');
                
                break;
            case 'ebay':
                if (!parsed._nkw) return alert('Error: URL is missing a keyword.');
            default:
                break;
        };
        
        let keywords = localStorage.getItem('keywords');
       
        if (!keywords) {
            let newKeywords = [{platform: config.platform, keyword: config.keyword, url: url, online: false}];
            localStorage.setItem('keywords', JSON.stringify(newKeywords));
            return props.saveKeywords(newKeywords);
        } else if (keywords.length > 0) {
            keywords = JSON.parse(keywords);
            console.log(keywords);
            let doesKeywordAlreadyExist = keywords.filter(url => url.keyword === config.keyword);
            if (doesKeywordAlreadyExist.length > 0) return alert('Keyword already saved.')
            let newKeywords = [...keywords, {platform: config.platform, keyword: config.keyword, url: url, online: false}];
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
