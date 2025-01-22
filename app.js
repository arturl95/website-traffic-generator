const { Actor } = require('apify');
const { PlaywrightCrawler } = require('crawlee');
const randomUserAgent = require('random-useragent');

(async () => {
    await Actor.init();

    const input = await Actor.getInput();
    if (!input || !Array.isArray(input.startUrls) || input.startUrls.length === 0) {
        throw new Error('No valid Start URLs provided in the input.');
    }

    const {
        startUrls,
        proxyCountryCode,
        useProxy,
        enableCrawling = false,
        crawlingLinkSelector = "a",
        blockUrlPatterns = [],
        waitOnPage = 60,
        endAfterSeconds = 600,
        duplicateActor = 1,
    } = input;

    // Global timeout to exit the actor after endAfterSeconds
    const globalTimeout = setTimeout(async () => {
        console.log(`Global timeout of ${endAfterSeconds} seconds reached. Exiting actor.`);
        await Actor.exit();
    }, endAfterSeconds * 1000); // Convert seconds to milliseconds

    let proxyConfiguration;
    if (useProxy) {
        console.log(`Using residential proxies with country code: ${proxyCountryCode}`);
        proxyConfiguration = await Actor.createProxyConfiguration({
            groups: ['RESIDENTIAL'],
            countryCode: proxyCountryCode,
        });
    } else {
        console.log('Not using proxies. All requests will be direct.');
    }

    const crawler = new PlaywrightCrawler({
        launchContext: {
            launchOptions: { headless: true }, // Change to false if you want to see the browser
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
                    if (blockUrlPatterns.some(pattern => url.includes(pattern)) || /\.(jpg|jpeg|png|gif|css|js|woff|svg|ico|json)$/.test(url)) {
                        route.abort();
                    } else {
                        route.continue();
                    }
                });
            },
        ],
        requestHandler: async ({ page, request }) => {
            console.log(`Navigating to ${request.url}`);
            await page.goto(request.url, { timeout: 60000 }); // 60 seconds timeout for navigation
            console.log(`Pageview mode activated. Waiting on page for ${waitOnPage} seconds.`);
            await page.waitForTimeout(waitOnPage * 1000);

            if (enableCrawling) {
                console.log(`Crawling enabled. Extracting links using selector: ${crawlingLinkSelector}`);
                const links = await page.$$eval(crawlingLinkSelector, (anchors) =>
                    anchors.map(anchor => anchor.href)
                );
                for (const link of links) {
                    // Check if the link is a valid URL (not a mailto link)
                    if (!link.startsWith('mailto:')) {
                        console.log(`Queueing link: ${link}`);
                        await crawler.addRequests([link]);
                    } else {
                        console.log(`Skipping mailto link: ${link}`);
                    }
                }
            }

            console.log(`Finished processing: ${request.url}`);
        },
        failedRequestHandler: ({ request }) => {
            console.error(`Failed to process ${request.url}`);
        },
    });

    console.log(`Starting Traffic Generator.`);
    try {
        await crawler.run(startUrls.map(({ url }) => ({ url })));

        for (let i = 1; i <= duplicateActor; i++) {
            console.log(`Starting duplicate actor run #${i}`);
            await crawler.run(startUrls.map(({ url }) => ({ url })));
        }
    } finally {
        // Clear the global timeout to prevent premature exit
        clearTimeout(globalTimeout);
        console.log('Traffic Generator Actor finished.');
        await Actor.exit();
    }
})();
