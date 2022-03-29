import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Image, Menu, Modal, Header, Portal, Segment, Form, Button, Icon, Input, Divider, Confirm, Dropdown } from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { updateKeywords, deleteKeyword } from "../store/actions/action";
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

function DeleteKeyword(props) {
    const [confirm, setConfirm] = useState(false);

    return (
        <Icon size="large" style={{margin:"10px"}} color="black" name='trash' link onClick={()=> setConfirm(!confirm)}>
            <Confirm
                open={confirm}
                content='Are you sure you want to delete this keyword?'
                confirmButton="Confirm"
                cancelButton="Cancel"
                onCancel={()=> {
                    return setConfirm(!confirm)
                }}
                onConfirm={()=> {
                    props.deleteKeyword(props.keyword);
                    return setConfirm(!confirm);
                }}
                size='mini'
            />
        </Icon>
    );
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords)),
        deleteKeyword: (keyword, saveKeywords) => dispatch(deleteKeyword(keyword, saveKeywords))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteKeyword);