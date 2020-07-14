import React, { useState, useEffect } from 'react'
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Confirm, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

function DeleteKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);
    
    return (
        <Icon size="large" style={{margin:"10px"}} color="black" name='trash' link onClick={()=> setConfirm(true)}>
            <Confirm
                open={showConfirm}
                content='Are you sure you want to delete this keyword?'
                confirmButton="Confirm"
                onCancel={()=> setConfirm(false)}
                onConfirm={()=> {
                    deleteKeyword(props.keyword).then(()=> props.refreshKeywords());
                    return setConfirm(false);
                }}
                size='mini'
            />
        </Icon>
    );
};

const deleteKeyword = async (keyword) => {
    let keywords = localStorage.getItem('keywords');
    keywords = JSON.parse(keywords);

    const newKeywords = keywords.filter(item => item.keyword !== keyword);
    console.log(newKeywords)
    return localStorage.setItem('keywords', JSON.stringify(newKeywords));
};

export default DeleteKeyword;