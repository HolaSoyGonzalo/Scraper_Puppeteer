const materials = require("./materials");

const scraperObject = {
  url: [
    "https://blu-verd.com/product-category/women/",
    "https://www.lenversfashion.com/collections/organic-cotton?page=",
    "https://www.lenversfashion.com/collections/hemp?page=",
  ],
  async scraper_blu(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url[0]}...`);

    let nextUrl = this.url[0];
    let hasNext = true;

    let urls = [];
    let scrapedData = [];

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
      scrapedData.push(products);
      console.log(products);
    }
    return scrapedData;
  },

  async scraper_lenversCotton(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url[1]}...`);

    let nextUrl = this.url[1];
    let hasNext = true;

    let urls = [];
    let scrapedData = [];
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
      await page.waitForSelector("body");
      let products = await page.$$eval(
        "div.proBoxInfo.boxinfo_stick_parentx.col-xs-12.col-sm-12.col-md-5",
        (elements) => {
          return elements.map((el) => {
            return {
              name: el.querySelector("h1").textContent.trim(),
              material: el
                .querySelector("div:nth-child(2)")
                .textContent.trim()
                .substring(0, 14),
            };
          });
        }
      );
      // products.map((product) => {
      //   extractMaterial(product.material);
      // });
      products = products.map((product) => {
        return {
          name: product.name,
          material: materials[product.material.toLowerCase().trim()] || null,
        };
      });
      scrapedData.push(products);
      console.log(products);
    }
    return scrapedData;
  },

  async scraper_lenversHemp(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url[2]}...`);

    // let nextUrl = this.url[2];
    // let hasNext = true;

    let urls = [];
    let scrapedData = [];
    // Navigate to the selected page
    await page.goto(this.url[2]);
    // Wait for the required DOM to be rendered
    await page.waitForSelector("#velaProList");
    let currentPageUrls = await page.$$eval("div.proHImage", (links) => {
      // Extract the links from the data
      links = links.map((el) => el.querySelector("a").href);
      return links;
    });
    urls.push(...currentPageUrls);
    // let nextPage = await page.$$eval("ul.pagination", (navbar) => {
    //   return navbar.map((navEl) => {
    //     let nextPageUrlHolder = navEl.querySelector(
    //       "ul.pagination > li.pagiNext > a"
    //     );
    //     return nextPageUrlHolder === null ? null : nextPageUrlHolder.href;
    //   });
    // });
    // nextUrl = nextPage[0];
    // hasNext = nextUrl !== null;
    // console.log(nextUrl);

    // console.log(urls);
    for (url of urls) {
      await page.goto(url);
      await page.waitForSelector("body");
      let products = await page.$$eval(
        "div.proBoxInfo.boxinfo_stick_parentx.col-xs-12.col-sm-12.col-md-5",
        (elements) => {
          return elements.map((el) => {
            return {
              name: el.querySelector("h1").textContent.trim(),
              material: el
                .querySelector("div:nth-child(2)")
                .textContent.trim()
                .substring(0, 4),
            };
          });
        }
      );
      products.map((product) => {
        extractMaterial(product.material);
      });
      products = products.map((product) => {
        return {
          name: product.name,
          material: materials[product.material.toLowerCase().trim()] || null,
        };
      });
      scrapedData.push(products);
      console.log(products);
    }
    return scrapedData;
  },
};

const extractMaterial = (string) => {
  let results = Object.keys(materials).filter((material) => {
    return string.toLowerCase().includes(material);
  });
  console.log(results);
};

module.exports = scraperObject;
