import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import AddKeyword from '../components/AddKeyword';
import DeleteKeyword from '../components/DeleteKeyword';
import StartKeyword from '../components/StartKeyword';
import EditKeyword from '../components/EditKeyword';
import KeywordLogCell from '../components/KeywordLogCell';
import { addLog, setKeywords, addKeyword, editKeyword, deleteKeyword } from "../store/actions";
import '../components/scrollbar.css'
import { loadSavedData, saveDataInStorage } from "../renderer.js";

function Keywords({ keywords, setKeywords, addKeyword, editKeyword, deleteKeyword }) {

    return (
        <div className='container mx-auto mt-5 lg:mt-0 px-5 scroller'>
            <div className="flex justify-between text-primaryText font-sans font-medium">
                <div className="self-center">
                    <span>Current Keywords</span>
                </div>
                <div className="self-end">
                    <AddKeyword addKeyword={addKeyword} />
                </div>
            </div>
            <div className="divide-solid bg-primaryText h-[.7px] mt-3"></div>
            <div className="mt-10 h-4xl w-full">
                <div className='rounded-xl relative overflow-auto bg-onPrimaryBg/25 shadow-lg scroller'>
                <div className="table w-full">
                    <div className="table-header-group ...">
                        <div className="table-row">
                        <div className="table-cell text-left text-primaryText py-3 px-6">ID</div>
                        <div className="table-cell text-left text-primaryText py-3 px-6">Keyword</div>
                        <div className="table-cell text-left text-primaryText py-3 px-6">Log</div>
                        <div className="table-cell text-center text-primaryText py-3 px-6">Actions</div>
                        </div>
                    </div>
                    <div className="table-row-group bg-onPrimaryBg rounded-xl">
                        {
                            keywords.length === 0 ? null 
                        : 
                            keywords.map((e, index) => {
                                return (
                                    <div key={index} className={`overflow-hidden table-row select-none text-primaryText text-xs border-b border-onPrimaryBgSofter`}>
                                    {/* <tr id={index} className={`select-none text-primaryText text-xs md:text-base lg:text-base border-b border-onPrimaryBgSofter ${activeRows.includes(index) ? 'bg-onPrimaryBgSofter' : ''}`}> */}
                                        <div id="id" className="table-cell py-3 px-6 truncate pointer-events-none">
                                            <span className="flex justify-left pointer-events-none">{e.id.substring(e.id.length - 4)}</span>
                                        </div>
                                        <div id="keyword" className="table-cell py-3 px-6 truncate pointer-events-none">
                                            <span className="flex justify-left pointer-events-none">{e.keyword}</span>
                                        </div>
                                        <div id="log" className="table-cell py-3 px-6 pointer-events-none max-w-[60px] w-2/4">
                                            {/* <span className="flex justify-left pointer-events-none">{e.log}</span> */}
                                            <KeywordLogCell keyword={e} active={e.online} />
                                        </div>
                                        <div id="actions" className="flex whitespace-nowrap flex-nowrap py-3 px-6 space-x-5 justify-center">
                                            <StartKeyword 
                                                keyword={e}  
                                            />
                                            {/* <svg id="test" className={`w-4 ml-3  text-nanoBlue/50 hover:text-nanoBlue/100 transform hover:scale-110 duration-300 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" fill="currentColor" viewBox="0 0 208.776 208.776" stroke="currentColor">
                                                <path className="pointer-events-none" d="M203.289,50.917L149.938,1.848c-2.822-2.596-7.208-2.438-9.836,0.354l-1.647,1.75c-2.671,2.838-2.51,7.312,0.359,9.95  l1.148,1.055L11.517,151.411c-5.63,5.98-8.567,13.795-8.271,22.003s3.788,15.791,9.833,21.351l6.479,5.96  c5.646,5.192,12.976,8.051,20.642,8.051c8.378,0,16.475-3.497,22.214-9.595L191.342,62.214l0.823,0.757  c2.822,2.596,7.208,2.438,9.836-0.354l1.647-1.75C206.319,58.029,206.158,53.555,203.289,50.917z M126.849,116.138L79.627,93.644  l65.875-69.983l36.659,33.717L126.849,116.138z"/>
                                            </svg> */}
                                            <EditKeyword index={index} keyword={e} editKeyword={editKeyword} />
                                            <DeleteKeyword 
                                                keyword={e} 
                                                deleteKeyword={deleteKeyword}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                                
                        }
                    </div>
                </div>
                
                </div>
            </div>
        </div>
    )
};

Keywords.propTypes = {
    keywords: propTypes.array,
    addKeyword: propTypes.func
}

const mapStateToProps = state => {
    return { keywords: state.keywords.keywords }
};

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: (data) => dispatch(addKeyword(data)),
        editKeyword: (data) => dispatch(editKeyword(data)),
        deleteKeyword: (data) => dispatch(deleteKeyword(data)),
        setKeywords: (data) => dispatch(setKeywords(data)),
        addLog: (log) => dispatch(addLog(log))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Keywords);