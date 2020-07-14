import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider } from 'semantic-ui-react';

import logo from './fb.png';
import '../fbscrape.css';

let user = JSON.parse(localStorage.getItem('user'));

function NavigationHeader(props) {
    const [activeItem, setActiveItem] = useState('');

    if (props.location.pathname.includes('/login')) return null;
    if (props.location.pathname.includes('/register')) return null;
    if (props.location.pathname.includes('/reset-password')) return null;
    console.log(activeItem)
    return (
        <Container>
            <Menu secondary widths={6} size="massive">
                <Menu.Item
                    as={ Link }
                    to="/home"
                    name='home'
                    active={activeItem === 'home'}
                    onClick={(e, { name })=> setActiveItem(name)}
                />
                <Menu.Item
                    as={ Link }
                    to="/keywords"
                    name='keywords'
                    active={activeItem === 'keywords'}
                    onClick={(e, { name })=> setActiveItem(name)}
                />
                <Menu.Item
                    as={ Link }
                    to="/logs"
                    name='logs'
                    active={activeItem === 'logs'}
                    onClick={(e, { name })=> setActiveItem(name)}
                />
                <Menu.Item
                    as={ Link }
                    to="/settings"
                    name='settings'
                    active={activeItem === 'settings'}
                    onClick={(e, { name })=> setActiveItem(name)}
                />
            </Menu>
        </Container>
    )
};
    

export default withRouter(NavigationHeader);
