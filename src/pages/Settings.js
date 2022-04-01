import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Container, Button, Divider, Input, TextArea, Segment, Header } from 'semantic-ui-react';
import { updateSettings } from "../store/actions/action";

const ipcRenderer = window.require('electron').ipcRenderer;
const Discord = require('discord.js');

function Settings(props) {
    const [settings, setSettings] = useState(props.status.settings ? props.status.settings : null);

    const saveSettings = async (settings) => {
        localStorage.setItem('settings', JSON.stringify(settings));
        return props.updateSettings(settings);
    };
    console.log(settings)
    return (
        <Container>
            <h2 className="page-header" margin={"20px"}>Settings</h2>
            <Divider />
            
            <Container>
                <h2 className="secondary-header" margin={"20px"}>Chrome File Path
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </h2>
                    <Button onClick={()=> {
                        changeChromePath().then(newPath => {
                            if (newPath === undefined) return;
                            setSettings({...settings, chromePath: newPath})
                        })
                    }}>Select File Path</Button>
                    <Segment>{settings ? settings.chromePath : null}</Segment>
                <h2 className="secondary-header">Discord Webhook
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </h2>
                <Button style={{marginBottom: "20px"}} onClick={()=> {
                        if (!settings || !settings.hasOwnProperty('discordWebhook')) return alert('Error: No Discord Webhook inserted.')
                        return testWebhook(settings.discordWebhook)
                    }}>Test Webhook</Button>
                <Input 
                    value={settings ? settings.discordWebhook : ''}
                    fluid 
                    placeholder="Webhook URL" 
                    onChange={(e)=> setSettings({...settings, discordWebhook: e.target.value.replace(/\s+/g, '')})}
                />
                <h2 className="secondary-header">Proxies 
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(optional - will use local connection to scrape if no proxies are inserted)</p>
                </h2>
                <TextArea value={settings && settings.hasOwnProperty('proxies') ? 
                        (settings.proxies.map(proxy => proxy + '\n')).toString().replace(/,/g, '')
                    : ''
                    } 
                    style={{height: "150px", width: "250px"}} 
                    placeholder={`IP:PORT:USERNAME:PASSWORD 
IP:PORT:USERNAME:PASSWORD`} 
                    onChange={(e)=> {
                        let proxyList = e.target.value.split("\n");
                        proxyList = proxyList.map(proxy => proxy.replace(/\s+/g, ''));
                        proxyList = proxyList.filter(proxy => proxy !== "");
                        return setSettings({...settings, proxies: proxyList})
                    }} 
                />
                <h2 className="secondary-header">Interval
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </h2>
                <Input
                    value={settings ? settings.interval : ''}
                    fluid 
                    placeholder="Time between each scrape in milliseconds. ex: 60000" 
                    onChange={(e)=> {
                        return setSettings({...settings, interval: e.target.value.replace(/\s+/g, '')})
                    }}
                />
                <h2 className="secondary-header">Theme
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(Default: Light)</p>
                </h2>
                <Button onClick={()=> props.changeTheme()}>{props.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Button>
            </Container>
            
            <Button fluid style={{marginTop:"20px", marginBottom: "50px"}} onClick={()=> {
                    if (!settings) return;// alert('Error: No settings to save.')
                    //if (settings.interval < 120000 && !settings.hasOwnProperty('proxies')) return alert('Error: You cannot set an interval lower than 2 minutes (120000ms) without proxies.');
                    return saveSettings(settings)
                }}>
                Save Changes
            </Button>
        </Container>
    )
};


const mapDispatchToProps = dispatch => {
    return {
        updateSettings: (settings) => dispatch(updateSettings(settings))
    };
};

const mapStateToProps = state => {
    return { status: state.status }
  };

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const changeChromePath = async () => {
    const newPath = await ipcRenderer.invoke('setChromePath');
    console.log(newPath);
    return newPath;
};

const testWebhook = async (discordWebhook) => {
    discordWebhook = discordWebhook.split('/webhooks/').pop();
    let id = await discordWebhook.match(/[^/]+/);
    let token = await discordWebhook.match(/[^/]+$/);
    console.log(token);
    console.log(id)
    
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Connected with FB Scrape 🟢')
        .setDescription('All new listings that match your filters will appear here.')
    
    return hook.send(embed);
};

// async function testWebhook(discordWebhook) {
//     discordWebhook = discordWebhook.split('https://discordapp.com/api/webhooks/').pop();
//     let id = await discordWebhook.match(/[^/]+/);
//     let token = await discordWebhook.match(/[^/]+$/);

//     const webhookClient = new Discord.WebhookClient(id, token);

//     await webhookClient.send('Connected with FB Scrape 🟢');

//     return webhookClient.destroy();
// };
