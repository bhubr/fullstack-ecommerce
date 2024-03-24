// To be executed in the browser console
(() => {
  // "scope-global" variables
  const serverUrl = "http://localhost:5010";

  /**
   * Send products to the server
   */
  const sendProducts = async (products) => {
    try {
      const productsEndpoint = "/products";
      const url = `${serverUrl}${productsEndpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      console.log("Products sent successfully");
    } catch (err) {
      console.error("Error while sending products", err);
    }
  };

  /**
   * Parse price comming under the form XXX,YY&nbsp;€
   */
  const parsePrice = (formattedPrice) => {
    // Split Unicode char code for non-breaking space
    const [pricePart, currencySymbol] = formattedPrice.split(/[\u00A0]/);
    // console.log(">> pricePart", pricePart, currencySymbol);
    const [intBit, decBit] = pricePart.split(",");
    const parsedInt = Number(intBit);
    if (Number.isNaN(parsedInt)) {
      throw new Error(
        `Could not parse integer part of price ${intBit} of ${pricePart}`
      );
    }
    const parsedDec = Number(decBit);
    if (Number.isNaN(parsedDec)) {
      throw new Error(
        `Could not parse decimal part of price ${decBit} of ${pricePart}`
      );
    }
    return Number(`${parsedInt}.${parsedDec}`);
  };

  const items = document
    .querySelector("ol.a-carousel")
    .querySelectorAll("li.a-carousel-card");
  const products = [];
  for (const item of items) {
    try {
      // link + pathname
      const linkEl = item.querySelector(".a-link-normal");
      const href = linkEl.href;
      const pathname = new URL(href).pathname;

      // title
      const titleEl = item.querySelector(".dcl-product-title");
      const title = titleEl.querySelector(".a-offscreen").textContent;

      // picture
      const imgEl = item.querySelector(".dcl-product-image-container img");
      const pictureUrl = imgEl.src;

      // price
      const priceEl = item.querySelector(".dcl-price-single");
      const currentPriceEl = priceEl.querySelector(".dcl-product-price-new");
      const currentPrice =
        currentPriceEl.querySelector(".a-offscreen").textContent;
      const current = parsePrice(currentPrice);

      // add to products
      products.push({
        title,
        link: {
          absolute: href,
          relative: pathname,
        },
        pictureUrl,
        price: {
          current,
        },
      });
    } catch (err) {
      console.error("Error while parsing item", err);
    }
  }
  console.log(JSON.stringify(products, null, 2));
  sendProducts(products).then(() => {
    console.log("Products sent successfully");
  });
})();
