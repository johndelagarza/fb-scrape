import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { updateKeywords, stopKeyword } from "../store/actions/action";
import 'react-notifications-component/dist/theme.css';

function StopKeyword(props) {
    const [showConfirm, setConfirm] = useState(false);
    
    return (
        <Icon size="large" style={{margin:"10px"}} color="red" name='stop' link onClick={()=> {
            props.stopKeyword(props.keyword);
        }}>
        </Icon>
    );
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords)),
        stopKeyword: (keyword) => dispatch(stopKeyword(keyword))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StopKeyword);