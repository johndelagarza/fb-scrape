import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter, Redirect, useLocation } from 'react-router-dom';
import { notify } from '../utils/notification';

//import './Scrollbar.css';
//import logo from '../assets/nano-logo.png';

function SettingsSidebar(props) {
    const [ active, setActive ] = useState('');
    const [redirect, setRedirect] = useState(false);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    };

    let query = useQuery();
    // useEffect(()=> {
    //     console.log(window.location.search.includes('settings'))
    //   }, [props.packages]);

    const handleClick = (e) => {
        return setActive(e.target.textContent);
    };

    return (
        <aside class="w-52 h-screen fixed overflow-y-auto" aria-label="Sidebar">
            <div class="h-screen overflow-y-auto py-4 px-3 bg-onPrimaryBg rounded">
            <ul class="space-y-2">
                <li>
                    <Link to="/settings?type=scrape" class={`${query.get("type") === "scrape" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                        <span class="ml-3 ">Scrape Settings</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings?type=proxies" class={`${query.get("type") === "proxies" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                        <span class="ml-3">Proxies</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings?type=notifications" class={`${query.get("type") === "notifications" ? 'bg-nanoGreen/25 hover:bg-nanoGreen hover:bg-opacity-20 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd"></path></svg>
                        <span class="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                    </Link>
                </li>
                {/* <li>
                    <Link to="/settings?type=themes" class={`${query.get("type") === "themes" ? 'bg-nanoGreen/25 pointer-events-none' : ''} flex items-center p-2 text-base font-normal text-primaryText rounded-lg hover:bg-primaryBg hover:text-primaryText hover:bg-opacity-20 duration-100`}>
                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd"></path></svg>
                        <span class="flex-1 ml-3 whitespace-nowrap">Themes</span>
                    </Link>
                </li> */}
            </ul>
            </div>
        </aside>
    )
};

const mapStateToProps = state => {
    return { status: state.status }
};

export default connect(mapStateToProps)(SettingsSidebar);