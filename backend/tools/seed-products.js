// 1. connect to database ../app-development.sqlite3
// 2. open ./products-all.json
// 3. read the content of the file
// 4. parse the content as JSON
// 5. insert each product into the database, with this corresponding fields (src item => db column):
//    - (none) => id (autoincrement)
//    - title => name
//    - "" => description (empty string, we don't have this info in the JSON)
//    - `price.current` => price
//    - pictureUrl => pictureUrl
//    - slug => slug

const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const slugify = require('slug');

const dbFile = path.resolve(__dirname, '../app-development.sqlite3');

const db = new sqlite.Database(dbFile);

const allProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, './products-all.json'))
);
const productsWithCatsAndDesc = JSON.parse(
  fs.readFileSync(path.join(__dirname, './products-with-descriptions.json'))
);

// console.log(products.length, productsWithCatsAndDesc.length);
// products will be: allProducts where we find a corresponding title in productsWithCatsAndDesc - we'll get description and category from there
// and all the other fields from allProducts
const products = allProducts.reduce((acc, product) => {
  const productWithCatAndDesc = productsWithCatsAndDesc.find(
    (p) => p.title === product.title
  );
  if (!productWithCatAndDesc) {
    console.error(
      `Could not find product with title ${product.title} in productsWithCatsAndDesc`
    );
    return acc;
  }
  if (!productWithCatAndDesc.category) {
    throw new Error(
      `Product with title ${product.title} is missing category in productsWithCatsAndDesc`
    );
  }
  return [
    ...acc,
    {
      ...product,
      description: productWithCatAndDesc.description,
      category: productWithCatAndDesc.category,
    },
  ];
}, []);

// Get unique category slugs
const categories = products.reduce((acc, item) => {
  const { category } = item;
  if (!acc.includes(category)) {
    acc.push(category);
  }
  return acc;
}, []);

console.log('>> cats', categories);

const categoryRecords = [];

// Insert categories in DB
db.serialize(
  () => {
    // phase 1 - insert categories
    db.run('DELETE FROM category');

    const stmt = db.prepare(
      'INSERT INTO category (name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?)'
    );

    categories.forEach((slug) => {
      // Derive name from slug (replace dashes with spaces and capitalize each word)
      const category = slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      stmt.run(category, slugify(slug), createdAt, updatedAt);
    });

    stmt.finalize();

    db.each('SELECT * FROM category', (err, row) => {
      console.log(row);
      categoryRecords.push(row);
    });
  },
  () => {
    console.log('DONE with category');
    // phase 2 - insert products
    db.serialize(() => {
      db.run('DELETE FROM product');

      const stmt = db.prepare(
        'INSERT INTO product (categoryId, name, description, price, pictureUrl, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );

      products.forEach((product) => {
        const pictureUrl = `/images/${product.slug}.jpg`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const categoryId = categoryRecords.find(
          ({ slug }) => slug === slugify(product.category)
        ).id;
        stmt.run(
          categoryId,
          product.title,
          product.description,
          product.price.current,
          pictureUrl,
          product.slug,
          createdAt,
          updatedAt
        );
      });

      stmt.finalize();

      db.each('SELECT * FROM product', (err, row) => {
        console.log(row);
      });
    });
  }
);
