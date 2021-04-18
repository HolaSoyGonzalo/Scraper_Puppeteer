const scraperObject = {
  url: "https://blu-verd.com/product-category/women/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".container");
    let urls = await page.$$eval(
      "li.product > div.top-product-section",
      (links) => {
        // Extract the links from the data
        links = links.map((el) => el.querySelector("a").href);
        return links;
      }
    );
    console.log(urls);
  },
};

module.exports = scraperObject;
