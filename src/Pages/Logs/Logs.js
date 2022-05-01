import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { clearLogs, addLog } from "../../store/actions";
import { formatDate } from '../../helpers/formateDate';
var uniqid = require('uniqid'); 

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Logs({ keywords, logs, addLog, clearLogs }) {

    return (
        <div className='container mx-auto mt-5 lg:mt-0 px-5'>
            <div className="flex justify-between text-primaryText font-sans font-medium">
                <div className="self-center">
                    <span>Logs</span>
                </div>
                <button onClick={()=> clearLogs()} className="self-end p-2 bg-onPrimaryBgSofter shadow-md rounded-md text-sm focus:outline-none outline-none hover:opacity-70 transition duration-200">
                    Clear Logs
                </button>
            </div>
            <div className="divide-solid bg-primaryText h-[.7px] mt-3"></div>
            <div className="mt-10 h-4xl w-full">
            <div className='rounded-xl relative overflow-auto bg-onPrimaryBg/25 shadow-lg scroller'>
                <div className="table w-full text-md">
                    <div className="table-header-group ...">
                        <div className="table-row">
                        <div className="table-cell text-left text-primaryText py-3 px-6">ID</div>
                        <div className="table-cell text-left text-primaryText py-3 px-6">Keyword</div>
                        <div className="table-cell text-left text-primaryText py-3 px-6">Event</div>
                        <div className="table-cell text-center text-primaryText py-3 px-6">Time</div>
                        </div>
                    </div>
                    <div className="table-row-group bg-onPrimaryBg rounded-xl">
                        {
                            logs.length === 0 ? null 
                        : 
                            logs.sort((x, y) => y.time - x.time).map((log)=> {
                                return (
                                    <div key={uniqid()} className={`overflow-hidden table-row text-primaryText text-xs border-b border-onPrimaryBgSofter`}>
                                    {/* <tr id={index} className={`select-none text-primaryText text-xs md:text-base lg:text-base border-b border-onPrimaryBgSofter ${activeRows.includes(index) ? 'bg-onPrimaryBgSofter' : ''}`}> */}
                                        
                                        <div key={uniqid()} id="id" className="table-cell py-3 px-6 truncate pointer-events-none">
                                            <span className="flex justify-left pointer-events-none">{log.id.substring(log.id.length - 4)}</span>
                                        </div>
                                        <div key={uniqid()} id="keyword" className="table-cell py-3 px-6 truncate pointer-events-none">
                                            <span className="flex justify-left pointer-events-none">{log.keyword}</span>
                                        </div>
                                        <div key={uniqid()} data-tip={log.message} id="log" className="table-cell py-3 px-6 max-w-[60px] w-2/4 whitespace-nowrap text-ellipsis overflow-hidden">
                                            <span className="flex justify-left">{log.message}</span>
                                        </div>
                                        <div key={uniqid()} id="actions" className="flex whitespace-nowrap flex-nowrap py-3 px-6 space-x-5 justify-center">
                                            <span className="flex justify-left pointer-events-none">{formatDate(Date(log.time))}</span>
                                        </div>
                                    </div>
                                )
                            })
                                
                        }
                    </div>
                </div>
                </div>
            </div>
            <ReactTooltip delayShow={100} />
        </div>
    )
};

Logs.propTypes = {
    keywords: propTypes.array,
    logs: propTypes.array,
    addLog: propTypes.func,
    clearLogs: propTypes.func
};

const mapStateToProps = state => {
    return { logs: state.logs.logs, keywords: state.keywords.keywords }
};

const mapDispatchToProps = dispatch => {
    return {
        clearLogs: () => dispatch(clearLogs()),
        addLog: (log) => dispatch(addLog(log))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);