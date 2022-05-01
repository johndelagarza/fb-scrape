import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

var uniqid = require('uniqid'); 
const { notify } = require('../../../helpers/notification');
const queryString = require('query-string');

function AddKeyword({ addKeyword }) {
    const [open, setModal] = useState(false);
    const [url, setUrl] = useState(null);

    useEffect(()=> {
        // handle if user clicks ESC
        const close = (e) => {
            if (e.keyCode === 27) {
              setModal(false)
            }
          }
          document.addEventListener('keydown', close)
        return () => document.removeEventListener('keydown', close)
    }, [open]);
    
    const add = async (url) => {
        const parsed = queryString.parse(url);
        console.log(parsed)
        if (!parsed.query) {
            parsed.query = 'Category'
            //return alert('Error: URL is missing a keyword.');
        }

        if (!url) return notify('Invalid keyword', 'No URL detected', 'warning');

        setModal(!open);
        document.getElementById("addKeywordInput").value = ""
        addKeyword({id: uniqid(), keyword: parsed.query, url: url, online: false});
        return;
    };

    return (
        <div className="inline-block">
            <button onClick={()=> setModal(true)} className="self-end p-2 bg-onPrimaryBgSofter shadow-md rounded-md text-sm focus:outline-none outline-none hover:opacity-70 transition duration-200">
                Add keyword
            </button>

            <div className={`absolute w-full h-full right-0 left-0 top-0 overflow-hidden bg-onPrimaryBg/50 z-50 ${open ? '' : 'hidden'}`}>
                <div className="z-50 w-5/7 max-h-72 h-64 bg-primaryBg absolute rounded-md  px-4 py-4 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <div className="relative w-full h-full">
                        <div className="flex justify-between w-full">
                            <h1 className="ml-1 mr-2">Add keyword</h1>
                            <svg onClick={()=> setModal(!open)} className={`w-8 inline ml-1 mr-2 text-primaryText transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <div className="relative inline">
                            <textarea
                                id="addKeywordInput"
                                onChange={(e)=> setUrl(e.target.value)}
                                rows="1" cols="1" 
                                spellCheck="false" 
                                className="border-none scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-onPrimaryBg scrollbar-thumb-onPrimaryBgSofter hover:scrollbar-thumb-onPrimaryBgSofter bg-primaryBg mt-5 px-2 py-1 resize-none w-full max-h-1/2 h-1/2 ml-auto mr-auto flex rounded-md text-nanoGreen text-sm focus:outline-none focus:ring-0" 
                                placeholder={`URL`} 
                            />
                            <button onClick={()=> add(url)} className="w-full bg-onPrimaryBg/50 mt-5 text-shadow rounded-md p-2 inline-flex items-center justify-center text-onHoverPrimaryText hover:bg-onPrimaryBgSoft">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AddKeyword.propTypes = {
    addKeyword: propTypes.func
};
        
export default AddKeyword;
