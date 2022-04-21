import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateKeywords } from "../store/actions/action";
var _ = require('lodash');
const { notify } = require('../utils/notification');

const queryString = require('query-string');

function EditKeyword(props) {
    const [open, setModal] = useState(false);
    const [url, setUrl] = useState(null);

    useEffect(()=> {
        // const close = (e) => {
        //     if(e.keyCode === 27){
        //       setActive(!active)
        //     }
        //   }
        //   window.addEventListener('keydown', close)
        // return () => window.removeEventListener('keydown', close)
    }, [open]);
    
    const editKeyword = async (url) => {
        //let currentUrls = localStorage.getItem('keywords');
        const parsed = queryString.parse(url);
        
        //let keywordIndex = props.status.keywords.findIndex(e => e.keyword === parsed.query);
        //if (keywordIndex < 0) return notify('Error', `You cannot change the keyword`, 'info');
        props.status.keywords[props.index] = { keyword: parsed.query, url: url, online: false, currentListings: [] };
        console.log({ keyword: parsed.query, url: url, online: false, currentListings: [] })
        localStorage.setItem('keywords', JSON.stringify(props.status.keywords));
        setModal(!open)
        return props.saveKeywords(props.status.keywords);
    };

    return (
        <div className='flex justify-center'>
            <svg onClick={()=> setModal(true)} id="edit" className={`space-x-5 w-5 text-nanoBlue/50 hover:text-nanoBlue/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path className="pointer-events-none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>

            <div className={`fixed w-full h-full right-0 left-0 top-0 overflow-hidden bg-onPrimaryBg/50 z-50 ${open ? '' : 'hidden'}`}>
            <div className="z-50 w-5/7 max-h-72 h-64 bg-primaryBg absolute rounded-md  px-4 py-4 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="relative w-full h-full">
                    <div className="flex justify-between w-full">
                        <h1 className="ml-1 mr-2">Edit keyword</h1>
                        <svg onClick={()=> setModal(!open)} className={`w-8 inline ml-1 mr-2 text-primaryText transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <div className="relative inline">
                        <textarea 
                            id="addKeywordInput"
                            onChange={(e)=> setUrl(e.target.value)}
                            defaultValue={props.keyword.url}
                            rows="1" cols="1" 
                            spellcheck="false" 
                            className="border-none scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-onPrimaryBg scrollbar-thumb-onPrimaryBgSofter hover:scrollbar-thumb-onPrimaryBgSofter bg-primaryBg mt-5 px-2 py-1 resize-none w-full max-h-1/2 h-1/2 ml-auto mr-auto flex rounded-md text-nanoGreen text-sm focus:outline-none focus:ring-0" 
                            //placeholder={`URL`} 
                        />
                        <button onClick={()=> editKeyword(url)} className="w-full bg-onPrimaryBg/50 mt-5 text-shadow rounded-md p-2 inline-flex items-center justify-center text-onHoverPrimaryText hover:bg-onPrimaryBgSoft">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};
        
const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        updateKeywords: (keywords) => dispatch(updateKeywords(keywords))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditKeyword);
