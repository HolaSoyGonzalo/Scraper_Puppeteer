const pageScraper = require("./pageScraper");

const fs = require("fs");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedData = {};
    scrapedData["lenvers_Hemp"] = await pageScraper.scraper_lenversHemp(
      browser,
      "scrapedData"
    );
    // scrapedData["lenvers_Cotton"] = await pageScraper.scraper_lenversCotton(
    //   browser,
    //   "scrapedData"
    // );
    // scrapedData["blu-verd"] = await pageScraper.scraper_blu(
    //   browser,
    //   "scrapedData"
    // );

    await browser.close();

    fs.writeFile(
      "data.json",
      JSON.stringify(scrapedData),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(
          "The data has been scraped and saved successfully! View it at './data.json'"
        );
      }
    );
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
