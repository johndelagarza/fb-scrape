import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Container, Image, Divider, List, Icon } from 'semantic-ui-react';
import { Header } from '../components/styled/elements';

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Home(props) {
    const [listings, setListings] = useState(null);

    useEffect(()=> {
        getAllListings(props.status.keywords)
            .then(data => setListings(data));
    }, [props.status.keywords]);
    //console.log(props.status)
    return (
        <Container>
            <Header margin={"20px"}>Newly Added Items</Header>
            <Divider />
            <List divided relaxed size="large">
                {
                    !listings ? null
                    : listings.map(listing => {
                        if (!listing) return null;
                        return (
                            <List.Item>
                                <Image 
                                    style={{cursor:'pointer'}} 
                                    size="small" 
                                    src={listing.image} 
                                    onClick={()=> ipcRenderer.invoke('open-listing', listing.url)} 
                                />
                                <List.Content>
                                    <List.Header>{listing.title}</List.Header>
                                    <List.Description>
                                        {listing.price}
                                        {listing.location ? listing.location : null}
                                    </List.Description>
                                    {listing.time ? moment.unix(listing.time).format('MMMM Do YYYY, h:mm:ss a').toString() : null}
                                    {listing.date ? listing.date : null}
                                </List.Content>
                            </List.Item>
                        )
                    })
                }
            </List>
            
        </Container>
    )
};

const getAllListings = async (keywords) => {
    let listings = [];

    if (!keywords) return;

    await keywords.forEach(keyword => {
        //console.log(keyword.currentListings)
        return listings = listings.concat(keyword.currentListings)
    });
    
    let newestFirst = listings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return newestFirst;
};

const mapStateToProps = state => {
    return { status: state.status }
  };

export default connect(mapStateToProps)(Home)
