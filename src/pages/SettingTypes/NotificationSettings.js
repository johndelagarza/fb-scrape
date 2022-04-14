import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { notify } from '../../utils/notification';

const ipcRenderer = window.require('electron').ipcRenderer;

function NotificationSettings(props) {

  const testDiscordWebhook = async () => {
    let discordWebhookInput = document.getElementById("discordWebhookInput");
    console.log(discordWebhookInput.value)
    const response = await ipcRenderer.invoke('testDiscordWebhook', discordWebhookInput.value);
  };

    
  return (
    <div className='container mt-5 lg:mt-0 px-5 text-primaryText'>
      <h1 className='text-xl font-bold'>Notification settings</h1>
      {/* <div class="divide-solid bg-primaryText h-[.7px] my-3" /> */}
      <div className='my-5'>
      <h2>Discord Webhook</h2>
      <p className='text-xs my-2 text-onPrimaryBgSofter'>Receive notifications via Discord</p>
      <div class="flex h-[30px]">
        
        <input id="discordWebhookInput" 
          defaultValue={props.settings.hasOwnProperty('discordWebhook') ? props.settings.discordWebhook : ''}
          onBlur={(e)=> props.saveSettings({...props.settings, discordWebhook: e.target.value})}
          spellcheck="false" 
          className="border-none hover:scrollbar-thumb-onPrimaryBgSofter bg-onPrimaryBgSoft w-full p-1 pl-4 rounded-l-full text-nanoGreen text-xs focus:outline-none focus:ring-0" 
          placeholder="https://discord.com/api/webhooks/776415516290326803/fqn4TkNDaeX-9ltW6vkwUaCxGXzcMpvy5Lk8FFWG29FPcZJhaItTqI-eljDv8GN_3Shb" 
        />
        <span onClick={()=> testDiscordWebhook()} class="inline-flex items-center px-8 text-xs bg-onPrimaryBg/25 rounded-r-full border border-l-0 border-primaryBg/25 cursor-pointer">
          Test
        </span>
      </div>
    </div>
      <div class="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      <div className='mb-5'>
        <h2>Desktop Notifications</h2>
        <p className='text-xs my-2 text-onPrimaryBgSofter'>Receive desktop notifications</p>
        <label for="headlessBrowserToggle" class="flex relative items-center mb-4 cursor-pointer max-w-fit">
          <input type="checkbox" id="headlessBrowserToggle" class="sr-only" 
            checked={props.settings.hasOwnProperty('desktopNotifications') ? props.settings.desktopNotifications : props.saveSettings({...props.settings, desktopNotifications: true})} 
            onClick={()=> props.saveSettings({...props.settings, desktopNotifications: (props.settings.desktopNotifications ? !props.settings.desktopNotifications : true)})} 
          />
          <div class="w-11 h-6 bg-onPrimaryBgSofter rounded-full border border-onPrimaryBgSofter toggle-bg"></div>
          <span class="ml-3 font-medium text-onPrimaryBgSofter text-xs">{props.settings.hasOwnProperty('desktopNotifications') ? props.settings.desktopNotifications.toString() : ''}</span>
        </label>
        <div class="divide-solid bg-onPrimaryBgSofter h-[.7px] my-3" />
      </div>
      <ReactTooltip delayShow={100} />  
    </div>
  )
};

export default NotificationSettings;
