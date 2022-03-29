import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider } from 'semantic-ui-react';
import styled, { withTheme } from 'styled-components';
import '../fbscrape.css';

let user = JSON.parse(localStorage.getItem('user'));

function NavigationHeader(props) {
    const [activeItem, setActiveItem] = useState('');

    if (props.location.pathname.includes('/home')) return setActiveItem('home');
    if (props.location.pathname.includes('/register')) return null;
    if (props.location.pathname.includes('/reset-password')) return null;
    
    return (
        <Container>
            <Menu secondary widths={6} size="massive">
                <Menu.Item
                    as={ Link }
                    to="/"
                    name='items'
                    active={props.location.pathname === '/'}
                />
                <Menu.Item
                    as={ Link }
                    to="/keywords"
                    name='keywords'
                    active={props.location.pathname.includes('/keywords')}
                />
                <Menu.Item
                    as={ Link }
                    to="/logs"
                    name='logs'
                    active={props.location.pathname.includes('/logs')}
                />
                <Menu.Item
                    as={ Link }
                    to="/settings"
                    name='settings'
                    active={props.location.pathname.includes('/settings')}
                />
            </Menu>
        </Container>
    )
};
    

export default withTheme(withRouter(NavigationHeader));
