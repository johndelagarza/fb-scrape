import React, { useState, useEffect } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Container, Image, Menu, Dropdown, Button, Divider, Input, TextArea, Segment } from 'semantic-ui-react';
import { Header } from '../components/styled/elements';

const ipcRenderer = window.require('electron').ipcRenderer;
const Discord = require('discord.js');

function Settings() {
    const [settings, setSettings] = useState(null);

    useEffect(()=> {
        getSettings().then(settings => setSettings(settings));
    }, []);
    console.log(settings)
    return (
        <Container>
            <Header margin={"20px"}>Settings</Header>
            <Divider />
            <Container>
                <Header margin={"20px"}>Chrome File Path
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </Header>
                    <Button onClick={()=> {
                        changeChromePath().then(newPath => {
                            if (newPath === undefined) return;
                            setSettings({...settings, chromePath: newPath})
                        })
                    }}>Select File Path</Button>
                    <Segment>{settings ? settings.chromePath : null}</Segment>
                <Header>Discord Webhook
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </Header>
                <Button style={{marginBottom: "20px"}} onClick={()=> {
                        if (!settings || !settings.hasOwnProperty('discordWebhook')) return alert('Error: No Discord Webhook inserted.')
                        return testWebhook(settings.discordWebhook)
                    }}>Test Webhook</Button>
                <Input 
                    value={settings ? settings.discordWebhook : null}
                    fluid 
                    placeholder="Webhook URL" 
                    onChange={(e)=> setSettings({...settings, discordWebhook: e.target.value.replace(/\s+/g, '')})}
                />
                <Header>Proxies 
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(optional - will use local connection to scrape if no proxies are inserted)</p>
                </Header>
                <TextArea value={settings && settings.hasOwnProperty('proxies') ? 
                        `${(settings.proxies.map(proxy => proxy + '\n')).toString().replace(/,/g, '')}` 
                    : null
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
                <Header>Interval
                    <p style={{display: "inline", fontSize:"13px", margin: "5px", fontWeight: "lighter"}}>(required)</p>
                </Header>
                <Input
                    value={settings ? settings.interval : null}
                    fluid 
                    placeholder="Time between each scrape in milliseconds. ex: 60000" 
                    onChange={(e)=> {
                        return setSettings({...settings, interval: e.target.value.replace(/\s+/g, '')})
                    }}
                />
            </Container>
            <Button fluid style={{marginTop:"50px"}} onClick={()=> {
                    if (!settings) return alert('Error: No settings to save.')
                    if (settings.interval < 120000 && !settings.hasOwnProperty('proxies')) return alert('Error: You cannot set an interval lower than 2 minutes (120000ms) without proxies.');
                    return saveSettings(settings)
                }}>
                Save Changes
            </Button>
        </Container>
    )
};

export default Settings

const getSettings = async () => {
    let settings = localStorage.getItem('settings');

    if (!settings) {
        return null;
    } else if (settings) {
        return JSON.parse(settings);
    };
};

const saveSettings = async (settings) => {
    return localStorage.setItem('settings', JSON.stringify(settings));
};

const changeChromePath = async (settings) => {
    const newPath = await ipcRenderer.invoke('setChromePath');
    console.log(newPath);
    return newPath;
};

const testWebhook = async (discordWebhook) => {
    discordWebhook = discordWebhook.split('https://discordapp.com/api/webhooks/').pop();
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

// const listProxies = async (proxies) => {
//     JSON.parse(settings.proxies).map(proxy => {
//         return proxy + '\n';                   
//       })
// };