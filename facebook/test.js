const puppeteer = require('puppeteer-core');
const discord = require('./discordWebhook');
const queryString = require('query-string');
const { createLogger, transports, format } = require('winston');
const moment = require('moment');





async function scrape() {
    let url = 'https://www.facebook.com/marketplace/107896742565570/search?minPrice=60&maxPrice=1000&sortBy=creation_time_descend&query=traeger&exact=false';
    let discordWebhook = 'https://discordapp.com/api/webhooks/660530375189069825/dVed_ujgf5PTg-XHuU7313yaBUAj9kX6vUrsyJnxT55xd-LWcnDCRco9NRLAU5bkH2OA';
    let proxies = ["193.203.15.207:27537",
                "193.203.15.137:6731",
                "193.203.15.155:45591",
                "193.203.15.203:59848",
                "193.203.15.21:22801",
                "193.203.15.161:7911",
                "193.203.15.155:51842",
                "193.203.15.149:8287",
                "193.203.15.20:44595",
                "193.203.15.138:55737",
                "193.203.15.124:24628",
                "193.203.15.182:35944",
                "193.203.15.200:9091",
                "193.203.15.12:22209",
                "193.203.15.204:58236",
                "193.203.15.91:50220",
                "193.203.15.133:12280",
                "193.203.15.115:11251",
                "193.203.15.173:6196",
                "193.203.15.245:24515"
            ];

    let path = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome';
    const urlParsed = queryString.parse(url);

    discordWebhook = discordWebhook.split('https://discordapp.com/api/webhooks/').pop();
    let discordWebhookId = discordWebhook.match(/[^/]+/);
    let discordWebhookToken = discordWebhook.match(/[^/]+$/);

    let randomUserAgent = userAgents[randomProxy(userAgents)];
    let proxy = '--proxy-server=' + proxies[randomProxy(proxies)];
    
    let maxPrice = parseInt(urlParsed.maxPrice) + (Math.floor(Math.random() * 25) + 1);

    let newUrl = url + `&maxPrice=${maxPrice}`;
    console.log({path, newUrl, randomUserAgent, proxy})
    const products = await getListings(path, newUrl, randomUserAgent, proxy).then(result => console.log(result));
    
    return products;
};

async function getListings(path, url, randomUserAgent, proxy) {
    //console.log(url)
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path,
        args: [proxy]
        // args: [proxy, "--no-sandbox", '--disable-gpu', '--disable-dev-shm-usage', '--no-zygote', '--no-first-run']
    });
    const context = await browser.createIncognitoBrowserContext(); // Launch incognito browser
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'}); // Make sure webpage displays english.
    await page.setViewport({width: 1920, height: 1080}); // Set screen size to insure it loads everything.
    await page.setUserAgent(randomUserAgent); // Set user-agent to insure we don't receive mobile version.
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(url);
    const listings = await page.waitForSelector('a[tabindex="0"]', {timeout: 10000})
        .then(async ()=> {
            console.log('finding products now...');
            const products = await page.evaluate(() => {
                let pageItems = Array.from(document.querySelectorAll('div[style="max-width: 390px; min-width: 190px;"]')); 
                //pageItems.length = 5;  
                console.log('page items: ' + pageItems.length)   
                return pageItems.map((listing)=> {
                        console.log(listing)
                        const title = listing.querySelector('div:nth-child(2) > div:nth-child(2)') 
                            ? listing.querySelector('div:nth-child(2) > div:nth-child(2)').textContent : null;
                        const price = listing.querySelector('div:nth-child(2) > div:nth-child(1)') 
                            ? listing.querySelector('div:nth-child(2) > div:nth-child(1)').textContent : null;
                        const location = listing.querySelector('div:nth-child(2) > div:nth-child(3)') 
                            ? listing.querySelector('div:nth-child(2) > div:nth-child(3)').textContent : null;
                        const url = listing.querySelector('[href]')
                            ? 'https://www.facebook.com' + listing.querySelector('[href]').getAttribute('href') : null;
                        const image = listing.querySelector('img') 
                            ? listing.querySelector('img').getAttribute('src') : null;
                        
                        //console.log({ title: title, price: price, location: location, url: url, image: image })
                        return { title: title, price: price, location: location, url: url, image: image };
                    });
                });
                
                browser.close();
                
                return products.filter(product => product.url !== null);
        });
    console.log('listings length: ' + listings.length);
    console.log(listings)
    return listings;
    //await page.screenshot({path: `${config.username + config.keyword}.png`});
};

const previousListings = async (username, url) => {
    let urlBeingScraped = await User.findOne({ username: username })
        .then((user)=> {
            let currentScrapes = user.currentScrapes;
            let currentUrl = currentScrapes.find((item)=> item.url === url);
            return currentUrl.currentItems;
        });
    console.log(`Checking ${urlBeingScraped.length} last scraped items for any new items.`)

    return urlBeingScraped
};

function generateRandomNumber() {
    var min = 0.00001,
        max = 0.0022,
        highlightedNumber = Math.random() * (max - min) + min;

    return highlightedNumber;
};

function randomProxy(proxies) {
    var min = 0,
        max = proxies.length,
        highlightedNumber = Math.random() * (max - min) + min;

    return ~~highlightedNumber;
};

let userAgents = [
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36",
	"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-en) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.10",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7",
	"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; de-de) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.78.2 (KHTML, like Gecko) Version/6.1.6 Safari/537.78.2",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/537.86.7",
	"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
	"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; KTXN)",
	"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
	"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
	"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)",
	"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
	"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
	"Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
];

setInterval(scrape, 10000);
//let path = '../../../../../../Program Files (x86)/Google/Chrome/Application/chrome';
//let path = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome';
//let path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome';

// async function test(path) {
//     const browser = await puppeteer.launch({
//         headless: false,
//         executablePath: path
//         // args: [proxy, "--no-sandbox", '--disable-gpu', '--disable-dev-shm-usage', '--no-zygote', '--no-first-run']
//     });
//     const context = await browser.createIncognitoBrowserContext();
//     const page = await context.newPage();
//     await page.goto('https://www.google.com');
//     return console.log('this shit is working!')
// };



module.exports = { scrape: scrape };

