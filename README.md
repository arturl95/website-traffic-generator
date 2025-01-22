# Traffic Generator Actor

The **Traffic Generator Actor** is a tool designed to simulate traffic on target URLs, including YouTube videos. By opening the specified URLs in a browser, it mimics user behavior to generate page views, helping enhance visibility and test website stability.

---

## Features

- **Simulated Page Views**: Generate realistic visits to your target URLs.
- **Proxy Support**: Configure proxy settings to mimic visits from different geographic regions.
- **Crawling Capability**: Optionally crawl subpages of the target URLs.
- **Resource Blocking**: Optimize performance by blocking unnecessary resources like images and scripts.
- **Duplicate Runs**: Scale operations by running multiple actor instances simultaneously.

---

## How It Works

1. The actor navigates to the provided URLs using a browser.
2. It waits on the page for a specified duration (default: 60 seconds).
3. If crawling is enabled, the actor identifies and visits links within the page based on a CSS selector.
4. For YouTube videos, the actor simulates a view by playing the video for the configured time.

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
    "proxyCountryCode": "US",
    "enableCrawling": false,
    "crawlingLinkSelector": "a",
    "blockUrlPatterns": [],
    "waitOnPage": 60,
    "endAfterSeconds": 600,
    "duplicateActor": 1
}
```

### Parameters Explained

- **`startUrls`** (Required): List of URLs to simulate traffic on.
- **`proxyCountryCode`** (Optional): Two-letter country code for proxy usage (default: `"US"`).
- **`enableCrawling`** (Optional): Set to `true` to enable crawling of links on the target page.
- **`crawlingLinkSelector`** (Optional): CSS selector to identify links for crawling (default: `"a"`).
- **`blockUrlPatterns`** (Optional): Array of URL patterns to block (e.g., `[".jpg", ".css"]`).
- **`waitOnPage`** (Optional): Time in seconds to stay on each page (default: 60 seconds).
- **`endAfterSeconds`** (Optional): Maximum time in seconds for the actor to run (default: 600 seconds).
- **`duplicateActor`** (Optional): Number of additional actor instances to run simultaneously (default: 1).

---

## Example Usage

### YouTube Traffic Generation

To generate views for a YouTube video, use the following input:
```json
{
    "startUrls": [
        {
            "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"
        }
    ],
    "proxyCountryCode": "US",
    "waitOnPage": 120,
    "endAfterSeconds": 1200,
    "duplicateActor": 2
}
```

This configuration:
- Generates views for the specified YouTube video.
- Simulates 10 views by waiting 120 seconds per view and running for 1200 seconds.
- Uses 2 duplicate actor instances to scale traffic generation.

---

## Running the Actor

### On Apify Platform
1. Deploy the actor to Apify.
2. Configure the input as described above.
3. Start the actor and monitor its progress via the logs.
