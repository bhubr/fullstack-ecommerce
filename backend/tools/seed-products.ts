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
import fs from 'node:fs/promises';
import path from 'node:path';
import slugify from 'slug';
import DatabaseService from '../src/services/database-service';

interface Product {
  title: string;
  link: {
    absolute: string;
    relative: string;
  };
  pictureUrl: string;
  price: {
    current: number;
  };
  slug: string;
  category: string;
  description: string;
}

interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

async function readAndProcessProductFiles(): Promise<{
  products: Product[];
  categories: string[];
}> {
  // const allProducts = JSON.parse(
  //   await fs.readFile(path.join(__dirname, './products-all.json'), 'utf-8')
  // );
  // const productsWithCatsAndDesc = JSON.parse(
  //   await fs.readFile(
  //     path.join(__dirname, './products-with-descriptions.json'),
  //     'utf-8'
  //   )
  // );

  // console.log(products.length, productsWithCatsAndDesc.length);
  // products will be: allProducts where we find a corresponding title in productsWithCatsAndDesc - we'll get description and category from there
  // and all the other fields from allProducts
  // const products = allProducts.reduce((acc, product) => {
  //   const productWithCatAndDesc = productsWithCatsAndDesc.find(
  //     (p) => p.title === product.title
  //   );
  //   if (!productWithCatAndDesc) {
  //     console.error(
  //       `Could not find product with title ${product.title} in productsWithCatsAndDesc`
  //     );
  //     return acc;
  //   }
  //   if (!productWithCatAndDesc.category) {
  //     throw new Error(
  //       `Product with title ${product.title} is missing category in productsWithCatsAndDesc`
  //     );
  //   }
  //   const theDevil = 'amazon';
  //   return [
  //     ...acc,
  //     {
  //       ...product,
  //       link: product.link.relative,
  //       pictureUrl: product.pictureUrl.replace(
  //         `https://m.media-${theDevil}.com`,
  //         ''
  //       ),
  //       description: productWithCatAndDesc.description,
  //       category: productWithCatAndDesc.category,
  //     },
  //   ];
  // }, []);

  // // Save products as products-seed.json
  // await fs.writeFile(
  //   path.join(__dirname, './products-seed.json'),
  //   JSON.stringify(products, null, 2)
  // );
  const productsJSON = await fs.readFile(
    path.join(__dirname, './products-seed.json'),
    'utf-8'
  )
  const products = JSON.parse(productsJSON)

  // Get unique category slugs
  const categories = products.reduce((acc, item) => {
    const { category } = item;
    if (!acc.includes(category)) {
      acc.push(category);
    }
    return acc;
  }, []);

  return { products, categories };
}

async function insertCategories(categoryAccentedSlugs: string[]) {
  const db = (await DatabaseService.getInstance()).getDB();
  // We'll use insertInto to insert categories
  // We'll use slugify to generate slugs
  // We'll use new Date().toISOString() to generate createdAt and updatedAt
  const specialWords = { pc: 'PC', et: 'et' };
  for (const accentedSlug of categoryAccentedSlugs) {
    const category = accentedSlug
      .split('-')
      .map((word) =>
        word in specialWords
          ? specialWords[word]
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
    const existingCategory = await db.getOneFromTableByField(
      'category',
      'name',
      category
    );
    if (existingCategory) {
      console.log('Category already exists', category);
      continue;
    }
    const slug = slugify(accentedSlug);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    console.log('Inserting category', category, slug, createdAt, updatedAt);

    await db.insertIntoTable('category', {
      name: category,
      slug,
      createdAt,
      updatedAt,
    });
  }
}

async function insertProducts(
  products: Product[],
  categoryRecords: CategoryRecord[]
) {
  // iterate over products
  // for each product, insert into product table
  // categoryId: find the category id from the category table
  const db = (await DatabaseService.getInstance()).getDB();
  for (const product of products) {
    const existingProduct = await db.getOneFromTableByField(
      'product',
      'slug',
      product.slug
    );
    if (existingProduct) {
      console.log('Product already exists', product.title);
      continue;
    }

    const pictureUrl = `/images/${product.slug}.jpg`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const category = categoryRecords.find(
      ({ slug }) => slug === slugify(product.category)
    );
    if ( category === undefined) {
      console.log(">> failed to find category id for category", product.category);
      console.log(">> all categories", categoryRecords);
      throw new Error(
        `Could not find category id for category ${product.category}`
      );
    }
    console.log(
      'Inserting product',
      category.id,
      product.title,
      product.description,
      product.price.current,
      pictureUrl,
      product.slug,
      createdAt,
      updatedAt
    );
    await db.insertIntoTable('product', {
      categoryId: category.id,
      name: product.title,
      description: product.description,
      price: product.price.current,
      pictureUrl,
      slug: product.slug,
      createdAt,
      updatedAt,
    });
  }
}

async function main() {
  const { products, categories } = await readAndProcessProductFiles();
  console.log('>> products', products.length);
  console.log('>> categories', categories.length);

  await insertCategories(categories);
  const { records: categoryRecords } = await (
    await DatabaseService.getInstance()
  )
    .getDB()
    .getAllFromTable<CategoryRecord>('category');
  await insertProducts(products, categoryRecords);
}

main();
