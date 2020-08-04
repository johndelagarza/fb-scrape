const puppeteer = require('puppeteer-core');
const queryString = require('query-string');

async function scrape(config, log) {
    const { path, url, proxies } = config;
    const keyword = queryString.parse(url)._nkw;
    
    log({keyword: keyword, message: 'Initializing scrape...', time: Math.floor(Date.now() / 1000) });
    let proxy;
    if (proxies) proxy = '--proxy-server=' + proxies[randomProxy(proxies)];
    console.log(proxy)
    let randomUserAgent = userAgents[randomProxy(userAgents)];
   
    const listings = await getListings(url, path, randomUserAgent, proxy);

    return listings;
};

async function getListings(url, path, randomUserAgent, proxy) {
    
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: path,
        args: [proxy]
    });

    console.log(browser.process().pid)
    try {
        //const context = await browser.createIncognitoBrowserContext(); 
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({'Accept-Language': 'en'}); 
        await page.setViewport({width: 1920, height: 1080}); 
        await page.setUserAgent(randomUserAgent); 
        await page.setRequestInterception(true);
        
        page.on('request', (req) => {
            if(req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        
        await page.goto(url, {timeout: 10000});
        //await timeout(3000);
        const listings = await page.waitForSelector('div[id="srp-river-results"]', {timeout: 10000})
        .then(async ()=> {
            const listings = await page.evaluate(() => {
                let pageItems = Array.from(document.querySelectorAll('li[class="s-item    s-item--watch-at-corner"]')); 
                pageItems.length = 10;  
 
                return pageItems.map((listing)=> {
                    const url = listing.querySelector('[href]')
                        ? listing.querySelector('[href]').getAttribute('href') : null;
                    const title = listing.querySelector('h3[class="s-item__title"]') 
                        ? listing.querySelector('h3[class="s-item__title"]').textContent.replace('New Listing', '') : null;
                    const price = listing.querySelector('span[class="s-item__price"]')
                        ? listing.querySelector('span[class="s-item__price"]').textContent : null;
                    const date = listing.querySelector('span[class="s-item__dynamic s-item__listingDate"]')
                        ? listing.querySelector('span[class="s-item__dynamic s-item__listingDate"]').textContent : null; 
                    const image = listing.querySelector('img') 
                        ? listing.querySelector('img').getAttribute('src') : null;
                        
                        return { title: title, price: price, url: url, image: image, date: date  };
                    });
                });
                let finalListings = listings.filter(listing => {
                        let listingContainsNullValues = Object.keys(listing).filter(key => listing[key] === null);
                        if (listingContainsNullValues.length > 0) return;
                        return listing;
                });
                console.log(finalListings)
                return finalListings;
        });

        browser.close();
        return listings;
    } catch (error) {
        console.log(error.message);
        browser.close();
        return null;
    };
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

//scrape('https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313.TR11.TRC2.A0.H1.Xpokemon+cards.TRS1&_nkw=pokemon+cards&_sacat=0&LH_TitleDesc=0&_sop=10&_osacat=0&_odkw=dark+charizard&LH_BIN=1', '194.5.154.73:30323', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome')