import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { clearLogs, addLog } from "../store/actions/action";

const moment = require('moment');
const ipcRenderer = window.require('electron').ipcRenderer;

function Logs(props) {
    const [logs, setLogs] = useState([]);

    useEffect(()=> {

        for (const { keyword } of props.status.keywords) {

            ipcRenderer.on(keyword, (event, msg)=> {
                console.log(msg)
                props.addLog(msg)
                //return //setLog(msg.message);
            });
        };
        return function cleanup() {
            for (const { keyword } of props.status.keywords) {
                ipcRenderer.removeAllListeners(keyword)
            }
        }

        return setLogs(props.status.logs);
    }, [props.status.logs]);
    
    return (
        <div className='container mx-auto mt-5 lg:mt-0 px-5'>
            <div className="flex justify-between text-primaryText font-sans font-medium">
                <div className="self-center">
                    <span>Logs</span>
                </div>
                <button onClick={()=> props.clearLogs()} className="self-end p-2 bg-onPrimaryBgSofter shadow-md rounded-md text-sm focus:outline-none outline-none hover:opacity-70 transition duration-200">
                    Clear Logs
                </button>
            </div>
            <div class="divide-solid bg-primaryText h-[.7px] mt-3"></div>
            <div className="mt-10 h-4xl w-full">
            <div className='rounded-xl relative overflow-auto bg-onPrimaryBg/25 shadow-lg scroller'>
                <div class="table w-full text-md">
                    <div class="table-header-group ...">
                        <div class="table-row">
                        <div class="table-cell text-left text-primaryText py-3 px-6">Keyword</div>
                        <div class="table-cell text-left text-primaryText py-3 px-6">Event</div>
                        <div class="table-cell text-center text-primaryText py-3 px-6">Time</div>
                        </div>
                    </div>
                    <div class="table-row-group bg-onPrimaryBg rounded-xl">
                        {
                            props.status.logs.length === 0 ? null 
                        : 
                            props.status.logs.sort((x, y) => y.time - x.time).map((log)=> {
                                return (
                                    <div className={`overflow-hidden table-row text-primaryText text-xs border-b border-onPrimaryBgSofter`}>
                                    {/* <tr id={index} className={`select-none text-primaryText text-xs md:text-base lg:text-base border-b border-onPrimaryBgSofter ${activeRows.includes(index) ? 'bg-onPrimaryBgSofter' : ''}`}> */}
                                        
                                        <div key={(log.keyword + log.time + log.message).toString()} id="keyword" className="table-cell py-3 px-6 truncate pointer-events-none">
                                            <span class="flex justify-left pointer-events-none">{log.keyword}</span>
                                        </div>
                                        <div data-tip={log.message} id="log" className="table-cell py-3 px-6 max-w-[60px] w-2/4 whitespace-nowrap text-ellipsis overflow-hidden">
                                            <span class="flex justify-left">{log.message}</span>
                                        </div>
                                        <div id="actions" className="flex whitespace-nowrap flex-nowrap py-3 px-6 space-x-5 justify-center">
                                            <span class="flex justify-left pointer-events-none">{log.time}</span>
                                        </div>
                                    </div>
                                )
                            })
                                
                        }
                    </div>
                </div>
                
                </div>
                {/* <div className='rounded-xl relative overflow-auto bg-onPrimaryBg/25'>
                    
                    <table id="keywords-table" className="table-auto w-full mx-auto leading-normal">
                        <thead>
                            <tr className="text-primaryText text-sm md:text-sm lg:text-sm">
                                <th className="py-3 px-6 text-left">Keyword</th>
                                <th className="py-3 px-6 text-left">Event</th>
                                <th className="py-3 px-6 text-center">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-onPrimaryBg scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-onPrimaryBg scrollbar-thumb-onPrimaryBgSofter hover:scrollbar-thumb-onPrimaryBgSofter">
                        
                            {
                                    props.status.logs.length === 0 ? null 
                                : 
                                    props.status.logs.sort((x, y) => y.time - x.time).map((log)=> { 
     
                                        return (
                                            <tr key={(log.keyword + log.time + log.message).toString()} className={`select-none text-primaryText text-xs md:text-base lg:text-base border-b border-onPrimaryBgSofter`}>
                                                
                                                <td id="keyword" className="py-3 px-6 text-left truncate pointer-events-none">
                                                    <span class="flex justify-left pointer-events-none">{log.keyword}</span>
                                                </td>
                                                <td id="log" className="py-3 px-6 text-left truncate pointer-events-none">
                                                    <span class="flex justify-left pointer-events-none">{log.message}</span>
                                                </td>
                                                <td id="time" className="py-3 px-6 text-left truncate pointer-events-none">
                                                    <span class="flex justify-left pointer-events-none">{log.time}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                
                            }
                            
                           </tbody>
                    </table>
                </div> */}
            </div>
            {/* <Table fixed unstackable size="small"> 
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Keyword</Table.HeaderCell>
                        <Table.HeaderCell>Event</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.status.logs.length === 0 ? null : props.status.logs.sort((x, y) => y.time - x.time).map((log)=> { 
                        return (
                            <Table.Row key={(log.keyword + log.time + log.message).toString()}>                                       
                                <Table.Cell>{log.keyword}</Table.Cell>
                                <Table.Cell>{log.message}</Table.Cell>
                                <Table.Cell>{moment.unix(log.time).format('MMMM Do YYYY, h:mm:ss a').toString()}</Table.Cell>
                            </Table.Row>
                            );                                 
                        })
                    }                      
                </Table.Body>
            </Table> */}
            <ReactTooltip delayShow={100} />
        </div>
    )
};

const mapStateToProps = state => {
    return { status: state.status }
};

const mapDispatchToProps = dispatch => {
    return {
        clearLogs: () => dispatch(clearLogs()),
        addLog: (log) => dispatch(addLog(log))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);