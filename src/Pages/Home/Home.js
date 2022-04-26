import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Loader, Card } from '../../components/elements/index.js';
import './Home.css';
import { loadSavedData, saveDataInStorage } from "../../renderer.js";

const moment = require('moment');

function Home({ keywords }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // useEffect(()=> {
    //     setLoading(true);
    //     getAllListings(keywords)
    //         .then(data => setListings(data), setLoading(false));
    // }, [keywords.length]);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);

    //if (loading) return <Loader active={loading} />
    console.log(keywords)
    console.log(listings)
    return (
        <div className="container mx-[28px] mt-5 lg:mt-0 px-5">
            <div className="flex text-primaryText font-sans font-medium h-[36.67px]">
                <div className="self-center">
                    <span>New Listings</span>
                </div>
            </div>
            <div className="divide-solid bg-primaryText h-[.7px] mt-3"></div>
            <div className='p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                {
                    currentItems.length === 0 ? null
                    : currentItems.map(listing => {
                        if (!listing) return null;
                        let time = moment.unix(listing.time).format('MMMM Do YYYY, h:mm:ss a').toString();
                        
                        return (
                            <Card id={listing.id} image={listing.image} title={listing.title} price={listing.price} location={listing.location} time={time} url={listing.url} />
                        )
                    })
                }
                
            </div>
            <div className='mb-[2.5rem] flex'>
                {
                    itemsPerPage >= listings.length ? null :
                    // <button className="pagination" onClick={()=> setItemsPerPage(itemsPerPage + itemsPerPage)}>
                    //     Load More
                    // </button>
                    <button onClick={()=> setItemsPerPage(itemsPerPage + itemsPerPage)} className="mx-auto p-2 bg-onPrimaryBgSofter shadow-md rounded-md text-sm focus:outline-none outline-none hover:opacity-70 transition duration-200">
                        Load More
                    </button>
                }
            </div>
        </div>
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
    return { keywords: state.keywords.keywords }
  };

export default connect(mapStateToProps)(Home)
