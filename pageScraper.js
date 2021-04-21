const materials = require("./materials");

const scraperObject = {
  url: "https://blu-verd.com/product-category/women/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    let nextUrl = this.url;
    let hasNext = true;

    let urls = [];

    while (hasNext) {
      // Navigate to the selected page
      await page.goto(nextUrl);
      // Wait for the required DOM to be rendered
      await page.waitForSelector(".container");
      let currentPageUrls = await page.$$eval(
        "li.product > div.top-product-section",
        (links) => {
          // Extract the links from the data
          links = links.map((el) => el.querySelector("a").href);
          return links;
        }
      );
      urls.push(...currentPageUrls);
      let nextPage = await page.$$eval("ul.page-numbers", (navbar) => {
        return navbar.map((navEl) => {
          return navEl.querySelector("ul.page-numbers > li > a.next") === null
            ? null
            : navEl.querySelector("ul.page-numbers > li > a.next").href;
        });
      });
      nextUrl = nextPage[0];
      hasNext = nextUrl !== null;
      console.log(nextUrl);
    }
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
  async scrapeOther(browser, url) {
    let page = await browser.newPage();
    console.log(`Navigating to ${url}...`);

    let nextUrl = url;
    let hasNext = true;

    let urls = [];

    while (hasNext) {
      // Navigate to the selected page
      await page.goto(nextUrl);
      // Wait for the required DOM to be rendered
      await page.waitForSelector("#velaProList");
      let currentPageUrls = await page.$$eval("div.proHImage", (links) => {
        // Extract the links from the data
        links = links.map((el) => el.querySelector("a").href);
        return links;
      });
      urls.push(...currentPageUrls);
      let nextPage = await page.$$eval("ul.pagination", (navbar) => {
        return navbar.map((navEl) => {
          let nextPageUrlHolder = navEl.querySelector(
            "ul.pagination > li.pagiNext > a"
          );
          return nextPageUrlHolder === null ? null : nextPageUrlHolder.href;
        });
      });
      nextUrl = nextPage[0];
      hasNext = nextUrl !== null;
      console.log(nextUrl);
    }
    // console.log(urls);
    for (url of urls) {
      await page.goto(url);
      await page.waitForSelector("head");
      let products = await page.$$eval("head", (elements) => {
        return elements.map((el) => {
          return {
            name: el.querySelector("title").textContent.trim(),
            material: el.querySelector("title").textContent.trim(),
          };
        });
      });
      products.map((product) => {
        extractMaterial(product.material);
      });
      // products = products.map((product) => {
      //   return {
      //     name: product.name,
      //     material:
      //       materials[product.material.split("%")[1].toLowerCase().trim()] ||
      //       null,
      //   };
      // });
      // console.log(products);
    }
  },
};

const extractMaterial = (string) => {
  let results = Object.keys(materials).filter((material) => {
    return string.toLowerCase().includes(material);
  });
  console.log(results);
};

module.exports = scraperObject;
