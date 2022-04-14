import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';

function NavigationHeader({ toggle }) {
    const [active, setActive] = useState('');

    const handleClick = (e) => {
        return setActive(e.target.id);
    };

    return (
        <div id="nav" class="bg-primaryBackground relative pt-6 px-4 z-11">
            <nav class="relative flex items-center justify-center w-full" aria-label="Global">
                <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0  md:hidden lg:hidden">
                    <div class="flex items-center justify-between w-full md:w-auto">
                        <a href="/">
                            <span class="sr-only">Workflow</span>
                            {/* <img class="h-lg w-auto lg:h-xl" src={nanoLogo} /> */}
                        </a>
                        <div class="-mr-2 flex items-center md:hidden">
                            <button onClick={()=> toggle()} type="button" class="bg-onPrimaryBgSoft rounded-md p-3 inline-flex items-center justify-center text-gray-400 hover:text-onHoverPrimaryText hover:opacity-70 duration-200 focus:outline-none outline-none" id="main-menu" aria-haspopup="true">
                            <span class="sr-only">Open main menu</span>
                            
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="hidden md:flex md:w-3/4 md:justify-evenly mb-6">
                    <Link
                        onClick={handleClick} 
                        to="/" 
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
    

export default withRouter(NavigationHeader);
