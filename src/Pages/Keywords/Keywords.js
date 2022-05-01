import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import AddKeyword from './components/AddKeyword';
import DeleteKeyword from './components/DeleteKeyword';
import StartKeyword from './components/StartKeyword';
import StopKeyword from './components/StopKeyword';
import EditKeyword from './components/EditKeyword';
import KeywordLogCell from './components/KeywordLogCell';
import { addLog, setKeywords, addKeyword, editKeyword, deleteKeyword } from "../../store/actions";
import '../../components/scrollbar.css';

function Keywords({ keywords, addKeyword, editKeyword, deleteKeyword }) {

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
                                            <StopKeyword keyword={e} />
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