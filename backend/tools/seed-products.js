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

const dbFile = path.resolve(__dirname, '../app-development.sqlite3');

const db = new sqlite.Database(dbFile);

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, './products-all.json'))
);

db.serialize(() => {
  db.run('DELETE FROM product');

  const stmt = db.prepare(
    'INSERT INTO product (name, description, price, pictureUrl, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  products.forEach((product) => {
    const pictureUrl = `/images/${product.slug}.jpg`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    stmt.run(
      product.title,
      '',
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
