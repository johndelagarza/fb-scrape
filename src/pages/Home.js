import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider, List } from 'semantic-ui-react';
import { Header } from '../components/styled/elements';

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Home() {
    const [listings, setListings] = useState(null);

    useEffect(()=> {
        getAllListings().then(data => setListings(data));
    }, []);

    return (
        <Container>
            <Header margin={"20px"}>Newly Added Items</Header>
            <Divider />
            <List divided relaxed size="large">
                {
                    !listings ? null
                    : listings.map(listing => {
                        return (
                            <List.Item>
                                <Image 
                                    style={{cursor:'pointer'}} 
                                    size="small" 
                                    src={listing.image} 
                                    onClick={()=> ipcRenderer.invoke('open-listing', listing.url)} 
                                />
                                <List.Content>
                                    <List.Header>{`${listing.title} - ${listing.price.replace(/[a-zA-Z](.*)/, '')}`}</List.Header>
                                    <List.Description>
                                        {listing.location}
                                       
                                    </List.Description>
                                    {listing.time ? moment.unix(listing.time).format('MMMM Do YYYY, h:mm:ss a').toString() : null}
                                </List.Content>
                            </List.Item>
                        )
                    })
                }
            </List>
        </Container>
    )
};

const getAllListings = async () => {
    let listings = [];

    const keywords = await JSON.parse(localStorage.getItem('keywords'));
    await keywords.forEach(keyword => {
        //keyword.currentListings.length = 3;
        return listings = [...listings, keyword.currentListings[0]]
        //return listings = [...listings].concat(keyword.currentListings)
    });
    console.log(listings);
    return listings;
};

export default Home
