import React from 'react';
import ReactTooltip from 'react-tooltip';
import { notify } from '../../../helpers/notification';

const ipcRenderer = window.require('electron').ipcRenderer;

function ScrapeSettings({ settings, updateSettings }) {

  const changeChromePath = async () => {
    const newPath = await ipcRenderer.invoke('setChromePath');
    console.log(newPath);
    if (newPath === undefined) return;
    
    updateSettings({...settings, chromePath: newPath})
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
      return updateSettings({...settings, interval: interval})
    }
  };
  
  return (
    <div className='container mt-5 lg:mt-0 px-5 text-primaryText'>
      <h1 className='text-xl font-bold'>Scrape settings</h1>
      {/* <div className="divide-solid bg-primaryText h-[.7px] my-3" /> */}
      <div className='my-5'>
        <h2>Chrome File Path</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Select your system's file path to chrome.exe</p>
        <div className='overflow-hidden'>
          <button onClick={()=> changeChromePath()} className="select-none px-5 py-1.5 text-xs rounded-full bg-onPrimaryBgSofter shadow-md focus:outline-none outline-none hover:opacity-70 transition duration-200 mr-5">
            Set File Path
          </button>
          <p data-tip={settings.chromePath || null} data-place="right" className='max-w-md w-3/4 inline self-center text-xs text-nanoGreen whitespace-nowrap overflow-ellipsis overflow-hidden cursor-default'>
            {settings.chromePath ? settings.chromePath.match(/([^\\]*$)/g)[0] : ''}
          </p>
        </div>
      </div>
      <div className="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      <div className='mb-5'>
        <h2>Headless Browser</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Hide the browser for each scrape</p>
        <label className="flex relative items-center mb-4 cursor-pointer max-w-fit">
          <input type="checkbox" id="headlessBrowserToggle" className="sr-only" 
            checked={settings.hasOwnProperty('headless') ? settings.headless : updateSettings({...settings, headless: true})} 
            onChange={()=> updateSettings({...settings, headless: (settings.headless ? !settings.headless : true)})} 
          />
          <div className="w-11 h-6 bg-onPrimaryBgSofter rounded-full border border-onPrimaryBgSofter toggle-bg"></div>
          <span className="ml-3 font-medium text-onPrimaryBgSofter text-xs">{settings.hasOwnProperty('headless') ? settings.headless.toString() : ''}</span>
        </label>
        <div className="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      </div>
      <div className='mb-5'>
        <h2>Rotate User Agents</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Each scrape uses a different user-agent</p>
        <label className="flex relative items-center mb-4 cursor-pointer max-w-fit">
          <input type="checkbox" id="rotateUserAgentsToggle" className="sr-only" 
            checked={settings.hasOwnProperty('rotateUserAgents') ? settings.rotateUserAgents : updateSettings({...settings, rotateUserAgents: true})} 
            onChange={()=> updateSettings({...settings, rotateUserAgents: (settings.rotateUserAgents ? !settings.rotateUserAgents : true)})} 
          />
          <div className="w-11 h-6 bg-onPrimaryBgSofter rounded-full border border-onPrimaryBgSofter toggle-bg"></div>
          <span className="ml-3 font-medium text-onPrimaryBgSofter text-xs">{settings.hasOwnProperty('rotateUserAgents') ? settings.rotateUserAgents.toString() : ''}</span>
        </label>
        <div className="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      </div>
      <div className='mb-5'>
        <h2>Scrape Interval</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Time between each scrape</p>
        <div className="flex h-[30px]">
          
          <input id="scrapeIntervalInput" 
            defaultValue={settings.hasOwnProperty('interval') ? settings.interval : ''}
            onBlur={(e)=> handleIntervalChange(e)}
            spellCheck="false" 
            className="border-none hover:scrollbar-thumb-onPrimaryBgSofter bg-onPrimaryBgSoft w-[75px] p-1 pl-4 rounded-l-full text-nanoGreen text-sm focus:outline-none focus:ring-0" 
            placeholder="30000" 
          />
          <span className="inline-flex items-center px-3 text-xs bg-onPrimaryBg/25 rounded-r-full border border-l-0 border-primaryBg/25 pointer-events-none">
            ms
          </span>
        </div>
      </div>
      <ReactTooltip delayShow={100} />  
    </div>
  )
};

export default ScrapeSettings;
