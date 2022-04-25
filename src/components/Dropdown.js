import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';

function Dropdown({ auth, isOpen, toggle }) {
    const [active, setActive] = useState('Home');

    const handleClick = (e) => {
        toggle();
        return setActive(e.target.id);
    };

    if (window.location.hash === "#/") return null;

    if (!auth.user) return <Redirect push to="/" />;

    return (
        <div className={ isOpen ? "z-10	absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden" : "hidden"}>
            <div className="rounded-lg shadow-md bg-primaryBg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                <img className="h-lg w-auto" alt="" src={require('../assets/icon2.png')}/>
                </div>
                <div className="-mr-2">
                <button onClick={()=> toggle()} type="button" className="bg-onPrimaryBgSoft rounded-md p-3 inline-flex items-center justify-center text-primaryText hover:text-gray-500 hover:text-onHoverPrimaryText hover:opacity-70 focus:outline-none outline-none duration-200">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
            </div>
            <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 text-center shadow-lg " role="none">
                    <Link
                        role="menuitem"
                        onClick={handleClick} 
                        to="/home" 
                        id="Home" 
                        className={`block px-3 py-2 rounded-md text-base font-medium text-primaryText hover:text-onHoverPrimaryText hover:bg-onPrimaryBgSoft duration-300 ${window.location.hash === "#/" ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        role="menuitem"
                        onClick={handleClick} 
                        to="/keywords" 
                        id="Keywords" 
                        className={`block px-3 py-2 rounded-md text-base font-medium text-primaryText hover:text-onHoverPrimaryText hover:bg-onPrimaryBgSoft duration-300 ${window.location.href.includes('keywords') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Keywords
                    </Link>
                    <Link 
                        role="menuitem"
                        onClick={handleClick} 
                        to="/logs" 
                        id="Logs" 
                        className={`block px-3 py-2 rounded-md text-base font-medium text-primaryText hover:text-onHoverPrimaryText hover:bg-onPrimaryBgSoft duration-300 ${window.location.href.includes('logs') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Logs
                    </Link>
                    <Link 
                        role="menuitem"
                        onClick={handleClick} 
                        to="/settings" 
                        id="Settings" 
                        className={`block px-3 py-2 rounded-md text-base font-medium text-primaryText hover:text-onHoverPrimaryText hover:bg-onPrimaryBgSoft duration-300 ${window.location.href.includes('settings') ? 'text-nanoGreen hover:text-nanoGreen' : ''}`}
                    >
                        Settings
                    </Link>
                </div>
            </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return { auth: state.auth }
};

export default (withRouter(connect(mapStateToProps)(Dropdown)));