# Traffic Generator Actor

The **Traffic Generator Actor** is a powerful tool designed to simulate user traffic on target URLs, including YouTube videos. By opening the specified URLs in a browser, it mimics user behavior to generate page views, helping enhance visibility, test website stability, and measure site performance.

---

## Features

- **Simulated Page Views**: Generate realistic visits to your target URLs.
- **Optional Proxy Support**: Use residential proxies to evade detection and mimic traffic from different geographic regions. Note: Residential proxies can be costly.
- **Crawling Capability**: Optionally crawl subpages of the target URLs to extend traffic generation.
- **Resource Blocking**: Optimize performance by blocking unnecessary resources such as images and scripts.

---

## How It Works

1. The actor navigates to the provided URLs using a browser.
2. It waits on the page for a specified duration (default: 60 seconds).
3. If crawling is enabled, the actor identifies and visits links within the page based on a CSS selector.
4. When using residential proxies, the traffic can evade detection, appearing more legitimate to the target site.

---

## Input Parameters

The actor accepts the following input configuration:

### Input Schema
```json
{
    "startUrls": [
        {
            "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"
        }
    ],
    "useProxy": true,
    "proxyCountryCode": "US",
    "enableCrawling": false,
    "crawlingLinkSelector": "a",
    "blockUrlPatterns": [],
    "waitOnPage": 60,
    "endAfterSeconds": 600
}
```

### Parameters Explained

- **`startUrls`** (Required): List of URLs to simulate traffic on.
- **`useProxy`** (Optional, Default: `true`): Enable or disable the use of residential proxies. If `false`, requests will use a direct connection.
- **`proxyCountryCode`** (Optional, Default: `"US"`): Two-letter country code for proxy usage. Ignored if `useProxy` is `false`.
- **`enableCrawling`** (Optional, Default: `false`): Set to `true` to enable crawling of links on the target page.
- **`crawlingLinkSelector`** (Optional, Default: `"a"`): CSS selector to identify links for crawling. Only used if `enableCrawling` is enabled.
- **`blockUrlPatterns`** (Optional, Default: `[]`): Array of URL patterns to block during traffic generation (e.g., `[".jpg", ".css"]`).
- **`waitOnPage`** (Optional, Default: `60`): Time in seconds to stay on each page.
- **`endAfterSeconds`** (Optional, Default: `600`): Maximum time in seconds for the actor to run before stopping.

---

## Notes on Proxies
- **Residential Proxies**: If `useProxy` is enabled, the actor uses residential proxies, which are harder to detect and block, providing more realistic traffic simulation. However, they can incur higher costs.
- **Direct Connection**: If `useProxy` is disabled, the actor uses a direct connection, which is free but easier to detect and block.

---

## Example Usage

### Generate Views for YouTube Videos

To generate views for a YouTube video, use the following input:
```json
{
    "startUrls": [
        {
            "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"
        }
    ],
    "useProxy": true,
    "proxyCountryCode": "US",
    "waitOnPage": 120,
    "endAfterSeconds": 1200
}
```

This configuration:
- Generates views for the specified YouTube video.
- Simulates 10 views by waiting 120 seconds per view and running for 1200 seconds.

### Generate Traffic Without Proxies

To generate traffic without using residential proxies:
```json
{
    "startUrls": [
        {
            "url": "https://www.example.com"
        }
    ],
    "useProxy": false,
    "waitOnPage": 60,
    "endAfterSeconds": 300
}
```

This configuration simulates traffic directly without proxies.

---

## Running the Actor

### On Apify Platform
1. Deploy the actor to Apify.
2. Configure the input as described above.
3. Start the actor and monitor its progress via the logs.

---

## Output

The actor logs detailed messages about:
- Navigation to each URL.
- Time spent on the page.
- Crawling activity (if enabled).
- Proxy configuration used (if applicable).

Monitor the effectiveness of the traffic generation directly through your analytics dashboard or tracking tools.

---

## Important Notes
- **Proxy Costs**: Using residential proxies significantly improves the quality of traffic but comes with higher costs. Plan usage accordingly.
- **Actor Timeout**: Ensure the `endAfterSeconds` parameter is set appropriately to control the actor's runtime and cost.