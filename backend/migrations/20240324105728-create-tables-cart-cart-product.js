'use strict';
const async = require('async');

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series(
    [
      (cb) =>
        db.createTable(
          'cart',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            userId: {
              type: 'int',
              notNull: true,
              foreignKey: {
                name: 'cart_user_id_fk',
                table: 'user',
                rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT',
                },
                mapping: 'id',
              },
            },
            checkedOutAt: 'string',
            createdAt: 'string',
            updatedAt: 'string',
          },
          cb
        ),
      (cb) =>
        db.createTable(
          'cart_product',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            cartId: {
              type: 'int',
              notNull: true,
              foreignKey: {
                name: 'cart_product_product_id_fk',
                table: 'user',
                rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT',
                },
                mapping: 'id',
              },
            },
            productId: {
              type: 'int',
              notNull: true,
              foreignKey: {
                name: 'cart_product_cart_id_fk',
                table: 'cart',
                rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT',
                },
                mapping: 'id',
              },
            },
            quantity: { type: 'int', notNull: true },
          },
          cb
        ),
    ],
    (err, results) => {
      callback(err, results);
    }
  );
};

exports.down = function (db, callback) {
  async.series(
    [(cb) => db.dropTable('cart', cb), (cb) => db.dropTable('cart_product', cb)],
    (err, results) => {
      console.log(err, results);
      callback(err, results);
    }
  );
};

exports._meta = {
  version: 1,
};
