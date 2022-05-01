//const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer-extra');
const queryString = require('query-string');
const moment = require('moment');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

async function scrape(config, log) {
    const { path, url, proxies, headless, rotateUserAgents } = config;
    const urlParsed = queryString.parse(url);
    //console.log(urlParsed)
    const keyword = config.keyword;
    //log({keyword: keyword, message: 'Initializing scrape...', time: Math.floor(Date.now() / 1000) });

    let proxy;
    if (proxies) proxy = '--proxy-server=' + proxies[randomProxy(proxies)];
    
    //let randomUserAgent = userAgents[randomProxy(userAgents)];
    let randomUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
    //proxies !== null ? proxy == '--proxy-server=' + proxies[randomProxy(proxies)] : null;
    
    log({id: keyword.id, keyword: keyword.keyword, message: `${proxies ? proxy : 'No proxy'}`, time: Math.floor(Date.now() / 1000)});
    //log({keyword: keyword, message: randomUserAgent, time: Math.floor(Date.now() / 1000) });
    let maxPrice = parseInt(100000) + (Math.floor(Math.random() * 25) + 1);
    //let urlBase = url.match(/(.*)[?]/);
    //urlBase = urlBase[1];
    let newUrl = url + `&maxPrice=${maxPrice}`;
    //console.log(newUrl)
    //log({keyword: keyword, message: newUrl, time: Math.floor(Date.now() / 1000)});
    //log({keyword: keyword, message: 'Pulling Listings', time: Math.floor(Date.now() / 1000)});
    const products = await getListings(path, url, randomUserAgent, proxy, keyword, headless, log);
    log({id: keyword.id, keyword: keyword.keyword, message: 'Returning listings.', time: Math.floor(Date.now() / 1000)});
    return products;
};

async function getListings(path, url, randomUserAgent, proxy, keyword, headless, log) {
    
    const browser = await puppeteer.launch({
        headless: headless,
        executablePath: path,
        args: (proxy ? [proxy] : ['--no-proxy-server'])
    });

    try {
       // Launch incognito browser
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({'Accept-Language': 'en'}); // Make sure webpage displays english.
        await page.setViewport({width: 1920, height: 1080}); // Set screen size to insure it loads everything.
        //await page.setViewport({width: 390, height: 844}); // Set screen size to insure it loads everything.
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"); // Set user-agent to insure we don't receive mobile version.
        //await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"); // Set user-agent to insure we don't receive mobile version.
        await page.setRequestInterception(true);
        
        page.on('request', (req) => {
            if(req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        
        log({id: keyword.id, keyword: keyword.keyword, message: 'Opening Facebook Marketplace', time: Math.floor(Date.now() / 1000)});
        await page.goto(url, {timeout: 10000});
        
        await timeout(3000);
        
        const listings = await page.waitForSelector('div[aria-label="Collection of Marketplace items"]', {timeout: 10000})
        //const listings = await page.waitForSelector('div[style="max-width:1872px"]', {timeout: 10000})
        //const listings = await page.waitForSelector('*[style="max-width: 1872px"]', {timeout: 30000})
            .then(async ()=> {
                const products = await page.evaluate(() => {

                    let pageItems = Array.from(document.querySelectorAll('div[style="max-width:1872px"] > div > div')); 
                    pageItems.length === 0 ? pageItems = Array.from(document.querySelectorAll('div[style="max-width: 1872px;"] > div > div')) : []

                    //pageItems.length = 7;  
                    console.log('Listings found: ' + pageItems.length);   
                    return pageItems.map((listing)=> {
                            console.log(listing.innerText)
                            if (listing.innerText === "") return;
                            console.log(listing)
                            const title = listing.querySelector('div:nth-child(2) > div:nth-child(2)') 
                                ? listing.querySelector('div:nth-child(2) > div:nth-child(2)').textContent : null;
                            const price = listing.querySelector('[dir]')
                                ? listing.querySelector('[dir]').textContent : null;
                            const location = listing.querySelector('div:nth-child(2) > div:nth-child(3)') 
                                ? listing.querySelector('div:nth-child(2) > div:nth-child(3)').textContent : null;
                            const url = listing.querySelector('[href]')
                                ? 'https://www.facebook.com' + listing.querySelector('[href]').getAttribute('href') : null;
                            const image = listing.querySelector('img') 
                                ? listing.querySelector('img').getAttribute('src') : null;
                            console.log(url)
                            let id = url.match(/item\/(.*)\//);
                            console.log(id)
                            return { title: title, price: price, location: location, url: url, id: id[1], image: image, time: Math.floor(Date.now() / 1000)};
                        });
                    });
                    let finalProducts = products.filter(product => product !== null);
                    console.log(finalProducts.length)
                    return finalProducts;
            });
        
       
        browser.close();
        log({id: keyword.id, keyword: keyword.keyword, message: 'Listings found: ' + listings.length, time: Math.floor(Date.now() / 1000)});
        return listings;
    } catch (error) {
        console.log(error.message);
        log({id: keyword.id, keyword: keyword.keyword, message: error.message, time: Math.floor(Date.now() / 1000)});
       
        browser.close();
        return null;
    };
};

// const previousListings = async (username, url) => {
//     let urlBeingScraped = await User.findOne({ username: username })
//         .then((user)=> {
//             let currentScrapes = user.currentScrapes;
//             let currentUrl = currentScrapes.find((item)=> item.url === url);
//             return currentUrl.currentItems;
//         });
//     console.log(`Checking ${urlBeingScraped.length} last scraped items for any new items.`)

//     return urlBeingScraped
// };

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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

module.exports = { scrape: scrape };