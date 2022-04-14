import React from 'react';
import { notify } from '../../utils/notification';
import '../../components/scrollbar.css'

function ProxiesSettings(props) {

  const handleProxyListChange = (e) => {
    let proxyListInput = document.getElementById("proxyListInput");

    let proxyList = e.target.value.split("\n");
    proxyList = proxyList.map(proxy => proxy.replace(/\s+/g, ''));
    proxyList = proxyList.filter(proxy => proxy !== "");
    return props.saveSettings({...props.settings, proxies: proxyList})
  };
  
  return (
    <div className='container mt-5 lg:mt-0 px-5 text-primaryText min-h-[300px]'>
        <div className='flex justify-between'>
          <h1 className='self-center text-xl font-bold'>Proxy settings</h1>
          <p className='text-nanoGreen font-bold self-center text-xl'><text className='text-primaryText text-xl font-normal'>Total:&nbsp; </text> {props.settings.proxies.length || 0}</p>
        </div>
        <div className='rounded-2xl bg-onPrimaryBg mt-5 p-2 h-2/4'>
          <textarea 
            defaultValue={props.settings.hasOwnProperty('proxies') ? (props.settings.proxies.map(proxy => proxy + '\n')).toString().replace(/,/g, '') : ''} 
            id="proxyListInput"
            onBlur={(e)=> handleProxyListChange(e)}
            cols="1" 
            spellcheck="false" 
            className="text-xs min-h-[200px] h-full scroller bg-onPrimaryBg border-none px-2 py-1 resize-none w-full ml-auto mr-auto text-nanoGreen focus:outline-none focus:ring-0" 
            placeholder={`IP:PORT \nIP:PORT:USERNAME:PASSWORD`} 
          />
        </div>
    </div>
  )
};

export default ProxiesSettings;
