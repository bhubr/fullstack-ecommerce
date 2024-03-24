// Get all products files in products folders, and from there:
// 1. read each JSON file
// 2. get each item from the parsed file contents (which is an array of items)
// 3. Recompute a new slug (there is one but it's too long) for each item,
//    based on the `link.relative` property (splitting it on `/` and using the part at index 1, URI-decoded before slugifying it)
// 4. If an image exists in folder `images` with name `<oldslug>.<ext>`, rename it to `<newslug>.<ext>`
// 5. Append theses items to a new array, omitting items that might have already been inserted from reading
//    previous files (based on the `link.relative` property)
// 6. Write the new array of items to a new JSON file in the current folder, named `products-all.json`
const fs = require("fs").promises;
const path = require("path");
const slug = require("slug");
const productsRoot = path.join(__dirname, "products");

async function concatProducts() {
  const files = await fs.readdir(productsRoot);
  const allItems = [];
  const seenItems = new Set();
  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const content = await fs.readFile(path.join(productsRoot, file), "utf-8");
    const items = JSON.parse(content);
    for (const item of items) {
      const parts = item.link.relative.split("/");
      const newSlug = slug(decodeURIComponent(parts[1]), { lower: true });
      // rename image if it exists
      const imgPath = path.join(__dirname, "images", `${item.slug}.jpg`);
      const newImgPath = path.join(__dirname, "images", `${newSlug}.jpg`);
      try {
        await fs.rename(imgPath, newImgPath);
        console.log(`Renamed image ${item.slug}.jpg to ${newSlug}.jpg`);
      } catch (err) {
        if (err.code !== "ENOENT") {
          // console.log("Image was not renamed (probably already done)")
        }
      }

      if (seenItems.has(newSlug)) {
        continue;
      }
      seenItems.add(newSlug);
      item.slug = newSlug;
      allItems.push(item);
    }
  }
  const newFilename = 'products-all.json';
  await fs.writeFile(newFilename, JSON.stringify(allItems, null, 2));
  console.log(`Wrote ${allItems.length} items to ${newFilename}`);
}

concatProducts().catch(console.error);
