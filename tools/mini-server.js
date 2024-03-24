// Express server with CORS, morgan, express.json()
// and a POST endpoint receiving an array of objects like so:
// {
//   "title": "Lenovo (FullHD 15,6 Zoll Ordinateur Portable (Intel® Quad N5100 4x2.80 GHz, 16Go DDR4, 1000 Go SSD, Intel™ UHD, HDMI, BT, USB 3.0, Webcam, WLAN, Windows 11, Clavier AZERTY [français]) #7388",
//   "link": {
//     "absolute": "https://www.site.com?ref=1234",
//     "relative": "/this-product-slug"
//   },
//   "pictureUrl": "https://media.site.com/1234.jpg",
//   "price": {
//     "current": 377
//   }
// }
//
// It should download the images and save them to disk to a folder named "images",
// with a slug derived from the product title
//

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const slug = require("slug");
const axios = require("axios");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// folder to save images
const imagesRoot = path.join(__dirname, "images");
if (!fs.existsSync(imagesRoot)) {
  fs.mkdirSync(imagesRoot);
}

// folder to save product definitions
const productsRoot = path.join(__dirname, "products");
if (!fs.existsSync(productsRoot)) {
  fs.mkdirSync(productsRoot);
}

/**
 * Download an image from a URL and save it to disk
 * @param {string} url - URL of the image to download
 * @param {string} filename - Filename to save the image to
 */
async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: "stream" });
  const absFilename = path.join(imagesRoot, filename);
  const writer = fs.createWriteStream(absFilename);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

/**
 * Async 1 second sleep
 */
async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * Asynchronously check if file exists
 */
async function existsAsync(filename) {
  try {
    await fsp.access(filename);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Write JSON data to a file
 * @param {string} filename - Filename to write to
 * @param {any} data - Data to write
 * @returns {Promise<void>}
 */
async function writeJSONAsync(filename, data) {
  await fsp.writeFile(filename, JSON.stringify(data, null, 2));
}

const slugify = item => {
  const parts = item.link.relative.split("/");
  return slug(decodeURIComponent(parts[1]), { lower: true });
}

app.post("/products", async (req, res) => {
  const productsWithSlugs = req.body.map((product) => ({
    ...product,
    slug: slugify(product),
  }));
  const productsFilename = path.join(
    productsRoot,
    `products-${Date.now()}.json`
  );
  await writeJSONAsync(productsFilename, productsWithSlugs);
  res.sendStatus(200);
  // Process files after sending response
  for (const product of productsWithSlugs) {
    const { pictureUrl, slug } = product;
    const filename = `${slug}.jpg`;
    const absFilename = path.join(imagesRoot, filename);
    if (await existsAsync(absFilename)) {
      console.log(`Skipping ${filename} as it already exists`);
      continue;
    }
    try {
      console.log(`Downloading ${filename}`);
      await downloadImage(pictureUrl, filename);
      await sleep();
    } catch (err) {
      console.error(`Error downloading ${filename}`, err);
    }
  }
});

const PORT = 5010;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
