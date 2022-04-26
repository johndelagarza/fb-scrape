import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from "../../../store/actions";

function SettingsSidebar({ user, logout }) {
    const [ active, setActive ] = useState('');
    const [redirect, setRedirect] = useState(false);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    };

    let query = useQuery();

    const handleClick = (e) => {
        return setActive(e.target.textContent);
    };
    
    return (
        <aside className="w-52 h-screen fixed overflow-y-auto" aria-label="Sidebar">
            <div className="h-screen overflow-y-auto py-4 px-3 bg-onPrimaryBg rounded">
            <ul className="space-y-2">
                <li>
                    <Link to="/settings?type=scrape" className={`${query.get("type") === "scrape" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg className="w-6 h-6 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                        <span className="ml-3 ">Scrape Settings</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings?type=proxies" className={`${query.get("type") === "proxies" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg className="w-6 h-6 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                        <span className="ml-3">Proxies</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings?type=notifications" className={`${query.get("type") === "notifications" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                        <span className="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                    </Link>
                </li>
                {/* <li>
                    <Link to="/settings?type=themes" className={`${query.get("type") === "themes" ? 'bg-nanoGreen/25 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd"></path></svg>
                        <span className="flex-1 ml-3 whitespace-nowrap">Themes</span>
                    </Link>
                </li> */}
                <div className="divide-solid bg-primaryText/25 h-[1px] m-3"></div>
                <li>
                    {user ? 
                        <div className="flex justify-evenly text-primaryText mt-5">
                            <span className=" whitespace-nowrap select-none">Logout</span>
                            <svg onClick={()=> logout()} className="w-6 h-6 mb-8 text-onPrimaryBgSofter hover:text-error cursor-pointer mt-auto transform hover:scale-110 duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        
                        : null
                    }
                </li>
            </ul>
                
            </div>
        </aside>
    )
};

const mapStateToProps = state => {
    return { auth: state.auth }
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSidebar);