import React from 'react';
const ipcRenderer = window.require('electron').ipcRenderer;

export function Card(props) {
    
    return (
        <div class="max-w-[15rem] max-h-[25rem] bg-onPrimaryBg rounded-lg shadow-md overflow-hidden">
            <a href="#">
                <img onClick={()=> ipcRenderer.invoke('open-listing', props.url)} class="h-44 w-full" src={props.image} alt="" />
            </a>
            <div class="p-5">
                <a>
                    <h5 class="mb-2 text-sm font-semibold tracking-tight text-primaryText whitespace-nowrap overflow-ellipsis overflow-hidden">{props.title}</h5>
                </a>
                <p class="mb-3 text-xs font-normal text-onPrimaryBgSofter">{props.price}</p>
                <p class="mb-3 text-xs font-normal text-onPrimaryBgSofter">{props.location}</p>
                <p class="text-xs font-normal text-onPrimaryBgSofter">{props.time}</p>
            </div>
        </div>
    )
};