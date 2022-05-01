import React, { useState } from 'react'
import { connect } from 'react-redux';
import 'react-notifications-component/dist/theme.css'
import fbLogo from '../../../assets/icon2.png';
import { editKeyword, stopKeyword  } from "../../../store/actions/";
import { notify } from '../../../helpers/notification';

const ipcRenderer = window.require('electron').ipcRenderer;

function StopKeyword({ settings, keyword, stopKeyword, editKeyword }) {

    const handleStop = () => {
        
        return stopKeyword(keyword);
    };

    return (
        <>
        <svg onClick={handleStop} className={`w-6 ml-3 text-error/50 hover:text-error/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 752 752" fill="currentColor">
            <path xmlns="http://www.w3.org/2000/svg" d="m562.93 612.79h-374.77c-26.922 0-48.945-22.027-48.945-48.941v-374.77c0-26.922 22.023-48.945 48.945-48.945h374.77c26.918 0 48.945 22.023 48.945 48.945v374.77c-0.003906 26.914-22.027 48.941-48.949 48.941z" fillRule="evenodd"/>
        </svg>
        </>
    );
};

const mapStateToProps = state => {
    return { settings: state.settings, keywords: state.keywords }
};

const mapDispatchToProps = dispatch => {
    return {
        editKeyword: (keyword) => dispatch(editKeyword(keyword)),
        stopKeyword: (keyword) => dispatch(stopKeyword(keyword))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StopKeyword);

