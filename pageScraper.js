const materials = require("./materials");

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
    for (url of urls) {
      await page.goto(url);
      await page.waitForSelector(".container");
      let products = await page.$$eval(
        "div.summary.entry-summary",
        (elements) => {
          return elements.map((el) => {
            return {
              name: el.querySelector("h1").textContent.trim(),
              material: el.querySelector(
                "div.clearfix > div.woocommerce-product-details__short-description > p"
              ).textContent,
            };
          });
        }
      );
      products = products.map((product) => {
        return {
          name: product.name,
          material:
            materials[product.material.split("%")[1].toLowerCase().trim()] ||
            null,
        };
      });
      console.log(products);
    }
  },
};

module.exports = scraperObject;
