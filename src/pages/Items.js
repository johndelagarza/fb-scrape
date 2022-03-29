import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Container, Image, Divider, List, Icon, Card, Loader, Button, Header } from 'semantic-ui-react';
import './Items.css';

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Home(props) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(()=> {
        setLoading(true);
        getAllListings(props.status.keywords)
            .then(data => setListings(data), setLoading(false));
    }, [props.status.keywords]);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <Loader active={loading} />
    
    return (
        <Container>
            <h2 className="page-header" margin={"20px"}>Newly Added Items</h2>
            <Divider />
            <Card.Group>
                {
                    currentItems.length === 0 ? null
                    : currentItems.map(listing => {
                        if (!listing) return null;
                        
                        return (
                            <Card centered key={listing.id}>
                                <Image 
                                    style={{cursor:'pointer'}} 
                                    src={listing.image} 
                                    onClick={()=> ipcRenderer.invoke('open-listing', listing.url)} 
                                />
                                <Card.Content>
                                    <Card.Header>{listing.title.length > 40 ? listing.title.substring(0, 40) + "..." : listing.title} - {listing.price.replace(/[a-zA-Z](.*)/, '')}</Card.Header>
                                    <Card.Description>
                                        {listing.location}
                                    </Card.Description>
                                    {listing.time ? moment.unix(listing.time).format('MMMM Do YYYY, h:mm:ss a').toString() : null}
                                </Card.Content>
                            </Card>
                        )
                    })
                }
                
            </Card.Group>
            {
                itemsPerPage >= listings.length ? null :
                <Button className="pagination" onClick={()=> setItemsPerPage(itemsPerPage + itemsPerPage)}>
                    Load More
                </Button>
            }
        </Container>
    )
};

const getAllListings = async (keywords) => {
    let listings = [];

    if (!keywords) return;

    await keywords.forEach(keyword => {
        
        return listings = listings.concat(keyword.currentListings)
    });
    
    let newestFirst = listings.sort((a, b) => b.time - a.time);
    
    return newestFirst;
};

const mapStateToProps = state => {
    return { status: state.status }
  };

export default connect(mapStateToProps)(Home)
