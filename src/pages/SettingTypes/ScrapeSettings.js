import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { notify } from '../../utils/notification';

const ipcRenderer = window.require('electron').ipcRenderer;

function ScrapeSettings(props) {

  const changeChromePath = async () => {
    const newPath = await ipcRenderer.invoke('setChromePath');
    console.log(newPath);
    if (newPath === undefined) return;
    
    props.saveSettings({...props.settings, chromePath: newPath})
    return newPath;
  };

  const handleIntervalChange = (e) => {
    let scrapeIntervalInput = document.getElementById("scrapeIntervalInput");
    let interval = parseInt(e.target.value);

    if (isNaN(interval) && e.target.value !== "") return notify('Not a number', 'Interval must be a number', 'danger');

    if (interval < 15000) {
      scrapeIntervalInput.value = "";
      scrapeIntervalInput.style.border = ".5px solid var(--color-error)"
      scrapeIntervalInput.focus()
      return notify('Too fast', 'Minimum speed is 15000ms', 'danger');
    }

    if (interval >= 15000) {
      scrapeIntervalInput.style.border = "none"
      return props.saveSettings({...props.settings, interval: interval})
    }
  };
  
  return (
    <div className='container mt-5 lg:mt-0 px-5 text-primaryText'>
      <h1 className='text-xl font-bold'>Scrape settings</h1>
      {/* <div class="divide-solid bg-primaryText h-[.7px] my-3" /> */}
      <div className='my-5'>
        <h2>Chrome File Path</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Select your system's file path to chrome.exe</p>
        <div className='overflow-hidden'>
          <button onClick={()=> changeChromePath()} className="select-none px-5 py-1.5 text-xs rounded-full bg-onPrimaryBgSofter shadow-md focus:outline-none outline-none hover:opacity-70 transition duration-200 mr-5">
            Set File Path
          </button>
          <p data-tip={props.settings.chromePath || null} data-place="right" className='max-w-md w-3/4 inline self-center text-xs text-nanoGreen whitespace-nowrap overflow-ellipsis overflow-hidden cursor-default'>
            {props.settings.chromePath ? props.settings.chromePath.match(/([^\\]*$)/g)[0] : ''}
          </p>
        </div>
      </div>
      <div class="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      <div className='mb-5'>
        <h2>Headless Browser</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Hide the browser for each scrape</p>
        <label for="headlessBrowserToggle" class="flex relative items-center mb-4 cursor-pointer max-w-fit">
          <input type="checkbox" id="headlessBrowserToggle" class="sr-only" 
            checked={props.settings.hasOwnProperty('headless') ? props.settings.headless : props.saveSettings({...props.settings, headless: true})} 
            onClick={()=> props.saveSettings({...props.settings, headless: (props.settings.headless ? !props.settings.headless : true)})} 
          />
          <div class="w-11 h-6 bg-onPrimaryBgSofter rounded-full border border-onPrimaryBgSofter toggle-bg"></div>
          <span class="ml-3 font-medium text-onPrimaryBgSofter text-xs">{props.settings.hasOwnProperty('headless') ? props.settings.headless.toString() : ''}</span>
        </label>
        <div class="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      </div>
      <div className='mb-5'>
        <h2>Rotate User Agents</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Each scrape uses a different user-agent</p>
        <label for="rotateUserAgentsToggle" class="flex relative items-center mb-4 cursor-pointer max-w-fit">
          <input type="checkbox" id="rotateUserAgentsToggle" class="sr-only" 
            checked={props.settings.hasOwnProperty('rotateUserAgents') ? props.settings.rotateUserAgents : props.saveSettings({...props.settings, rotateUserAgents: true})} 
            onClick={()=> props.saveSettings({...props.settings, rotateUserAgents: (props.settings.rotateUserAgents ? !props.settings.rotateUserAgents : true)})} 
          />
          <div class="w-11 h-6 bg-onPrimaryBgSofter rounded-full border border-onPrimaryBgSofter toggle-bg"></div>
          <span class="ml-3 font-medium text-onPrimaryBgSofter text-xs">{props.settings.hasOwnProperty('rotateUserAgents') ? props.settings.rotateUserAgents.toString() : ''}</span>
        </label>
        <div class="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      </div>
      <div className='mb-5'>
        <h2>Scrape Interval</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Time between each scrape</p>
        <div class="flex h-[30px]">
          
          <input id="scrapeIntervalInput" 
            defaultValue={props.settings.hasOwnProperty('interval') ? props.settings.interval : ''}
            onBlur={(e)=> handleIntervalChange(e)}
            spellcheck="false" 
            className="border-none hover:scrollbar-thumb-onPrimaryBgSofter bg-onPrimaryBgSoft w-[75px] p-1 pl-4 rounded-l-full text-nanoGreen text-sm focus:outline-none focus:ring-0" 
            placeholder="30000" 
          />
          <span class="inline-flex items-center px-3 text-xs bg-onPrimaryBg/25 rounded-r-full border border-l-0 border-primaryBg/25 pointer-events-none">
            ms
          </span>
        </div>
      </div>
      <ReactTooltip delayShow={100} />  
    </div>
  )
};

export default ScrapeSettings;
