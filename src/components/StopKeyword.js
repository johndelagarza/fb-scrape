import React, { useState, useEffect } from 'react'
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

function StopKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);
    
    return (
        <Icon size="large" style={{margin:"10px"}} color="red" name='stop' link onClick={()=> {
            stopKeyword(props.keyword).then(()=> props.refreshKeywords());
        }}>
        </Icon>
    );
};

const stopKeyword = async (keyword) => {
    let keywords = localStorage.getItem('keywords');
    keywords = JSON.parse(keywords);

    const elementIdex = keywords.findIndex(e => {
        return e.keyword === keyword.keyword;
    });
    let updatedKeyword = keywords[elementIdex] = {...keywords[elementIdex], online: false};

    keywords = keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
    
    return localStorage.setItem('keywords', JSON.stringify(keywords));
};

export default StopKeyword;