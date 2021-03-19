//Node Library
const puppeteer = require('puppeteer');
//File System Module
const fs = require("fs");

//Initiating the Puppeteer
    (async () => {
      const browser = await puppeteer.launch( {headless:false} );

//Opening new page and navigating the page
      const page = await browser.newPage();
      await page.goto('', {waitUntil: "networkidle2"});

//Retrieving the Content
      const data = await page.evaluate(() => {
            const id = document.querySelectorAll('.price-box');
            const ids = Array.from(id).map((v) => v.getAttribute("data-product-id"));
            const name = document.querySelectorAll('.product-item-link');
            const names = Array.from(name).map((v) => v.innerText);
            const currency = document.querySelectorAll('.code');
            const currencies = Array.from(currency).map((v) => v.innerText);
            const images = document.querySelectorAll('img');
            const urls = Array.from(images).map((v) => v.src);
            const price = document.querySelectorAll('.price-wrapper ');
            const prices = Array.from(price).map((v) => v.getAttribute("data-price-amount"));

//Exit and Pass details to the Product Array
    return ({names,prices,urls,currencies,ids})
      })


//Declaring the Array
    var product={"Product_details":[]}

//Javascript function for appending the product details
    for(let x=0;x<data.names.length;x++)
    {
        product.Product_details.push({
          "Product Id":data.ids[x],
          "Product Name":data.names[x],
          "Product Price":data.prices[x],
          "Product Image":data.urls[x],
          "Product Currency":data.currencies[x]
          
        })
      }

//Checking for duplicates
    for (i = 0; i < product.Product_details.length; i++)
      {
        for(a = 0; a<i; a++)
          {
            if(product.Product_details[a].id == product.Product_details[i].id)
              {
                product.Product_details.splice(i,1)
              }

          }
      }
      
//output of the scraped data
    console.log(product);

//Save data to json file
    const jsonData = JSON.stringify(product, null, 5);
        fs.writeFile("test.txt", jsonData, function(err) {
            //handling errors
            if (err) {
                    console.log(err);
                    }
                  });
        fs.writeFile("data.json", jsonData, function(err) {
            if (err) {
                    console.log(err);
                    }
                  });

//Closing the browser
    await browser.close();
})();

