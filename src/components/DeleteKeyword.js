import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { updateKeywords, deleteKeyword } from "../store/actions/action";
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

function DeleteKeyword(props) {
    const [confirm, setConfirm] = useState(false);

    return (
        <svg id="delete" onClick={()=> props.deleteKeyword(props.keyword)} className={`w-5 ml-3 text-error/50 hover:text-error/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path className="pointer-events-none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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