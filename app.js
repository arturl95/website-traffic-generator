const { Actor } = require('apify');
const { PlaywrightCrawler } = require('crawlee');
const randomUserAgent = require('random-useragent');

(async () => {
    await Actor.init();

    //const input = await Actor.getInput();
    const input = {
        startUrls: [
            {
                url: "https://www.youtube.com/watch?v=jNQXAC9IVRw"
            }
        ],
    };
    if (!input || !Array.isArray(input.startUrls) || input.startUrls.length === 0) {
        throw new Error('No valid Start URLs provided in the input.');
    }

    const {
        startUrls,
        proxyCountryCode = "US",
        enableCrawling = false,
        crawlingLinkSelector = "a",
        blockUrlPatterns = [],
        waitOnPage = 60,
        endAfterSeconds = 600,
        duplicateActor = 1,
    } = input;

    const proxyConfiguration = await Actor.createProxyConfiguration({
        groups: ['RESIDENTIAL'],
        countryCode: proxyCountryCode,
    });

    const crawler = new PlaywrightCrawler({
        launchContext: {
            launchOptions: { headless: false }, // Change to false if you want to see the browser
        },
        browserPoolOptions: {
            useFingerprints: true,
        },
        proxyConfiguration,
        maxRequestRetries: 2,
        preNavigationHooks: [
            async ({ page }) => {
                await page.setExtraHTTPHeaders({
                    'User-Agent': randomUserAgent.getRandom(),
                    'Accept-Language': 'en-US,en;q=0.9',
                });

                // Block unnecessary resources
                await page.route('**/*', (route) => {
                    const url = route.request().url();
                    if (blockUrlPatterns.some(pattern => url.includes(pattern))) {
                        route.abort();
                    } else {
                        route.continue();
                    }
                });
            },
        ],
        requestHandlerTimeoutSecs: endAfterSeconds,
        requestHandler: async ({ page, request }) => {
            console.log(`Navigating to ${request.url}`);
            await page.goto(request.url, { waitUntil: 'networkidle' });

            console.log(`Pageview mode activated. Waiting on page for ${waitOnPage} seconds.`);
            await page.waitForTimeout(waitOnPage * 1000);

            if (enableCrawling) {
                console.log(`Crawling enabled. Extracting links using selector: ${crawlingLinkSelector}`);
                const links = await page.$$eval(crawlingLinkSelector, (anchors) =>
                    anchors.map(anchor => anchor.href)
                );
                for (const link of links) {
                    console.log(`Queueing link: ${link}`);
                    await crawler.addRequests([link]);
                }
            }

            console.log(`Finished processing: ${request.url}`);
        },
        failedRequestHandler: ({ request }) => {
            console.error(`Failed to process ${request.url}`);
        },
    });

    console.log(`Starting Traffic Generator.`);
    await crawler.run(startUrls.map(({ url }) => ({ url })));

    for (let i = 1; i <= duplicateActor; i++) {
        console.log(`Starting duplicate actor run #${i}`);
        await crawler.run(startUrls.map(({ url }) => ({ url })));
    }

    console.log('Traffic Generator Actor finished.');
    await Actor.exit();
})();
