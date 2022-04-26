import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';

function NavigationHeader(props) {
    const [active, setActive] = useState('');

    const handleClick = (e) => {
        return setActive(e.target.id);
    };
    
    if (window.location.hash === "#/") return null;
    if (!props.auth.user) return <Redirect push to="/" />;

    return (
        <div id="nav" className="bg-primaryBackground relative pt-6 px-4 z-11">
            <nav className="relative flex items-center justify-center w-full" aria-label="Global">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0  md:hidden lg:hidden">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <a href="/">
                            <span className="sr-only">Workflow</span>
                            {/* <img className="h-lg w-auto lg:h-xl" src={nanoLogo} /> */}
                        </a>
                        <div className="-mr-2 flex items-center md:hidden">
                            <button onClick={()=> props.toggle()} type="button" className="bg-onPrimaryBgSoft rounded-md p-3 inline-flex items-center justify-center text-gray-400 hover:text-onHoverPrimaryText hover:opacity-70 duration-200 focus:outline-none outline-none" id="main-menu" aria-haspopup="true">
                            <span className="sr-only">Open main menu</span>
                            
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex md:w-3/4 md:justify-evenly mb-6">
                    <Link
                        onClick={handleClick} 
                        to="/home" 
                        id="Home" 
                        className={`text-xl font-medium text-primaryText hover:text-onHoverPrimaryText duration-300 ${window.location.hash === "#/" ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        onClick={handleClick} 
                        to="/keywords" 
                        id="Keywords" 
                        className={`text-xl font-medium text-primaryText hover:text-onHoverPrimaryText duration-300 ${window.location.href.includes('keywords') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Keywords
                    </Link>
                    <Link 
                        onClick={handleClick} 
                        to="/logs" 
                        id="Logs" 
                        className={`text-xl font-medium text-primaryText hover:text-onHoverPrimaryText duration-300 ${window.location.href.includes('logs') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Logs
                    </Link>
                    <Link 
                        onClick={handleClick} 
                        to="/settings?type=scrape" 
                        id="Settings" 
                        className={`text-xl font-medium text-primaryText hover:text-onHoverPrimaryText duration-300 ${window.location.href.includes('settings') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Settings
                    </Link>
                </div>
            </nav>
        </div>
    )
};
    
const mapStateToProps = state => {
    return { auth: state.auth }
};

export default (withRouter(connect(mapStateToProps)(NavigationHeader)));
