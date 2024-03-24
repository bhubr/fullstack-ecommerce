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
          'order',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            userId: {
              type: 'int',
              notNull: true,
              foreignKey: {
                name: 'order_user_id_fk',
                table: 'user',
                rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT',
                },
                mapping: 'id',
              },
            },
            reference: { type: 'string', notNull: true },
            addrStreet: { type: 'string', notNull: true },
            addrCity: { type: 'string', notNull: true },
            addrPostCode: { type: 'string', notNull: true },
            addrPhone: 'string',
            status: { type: 'string', notNull: true },
            createdAt: 'string',
            updatedAt: 'string',
          },
          cb
        ),
      (cb) =>
        db.createTable(
          'order_product',
          {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            orderId: {
              type: 'int',
              notNull: true,
              foreignKey: {
                name: 'order_product_product_id_fk',
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
                name: 'order_product_order_id_fk',
                table: 'order',
                rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT',
                },
                mapping: 'id',
              },
            },
            quantity: { type: 'int', notNull: true },
            price: { type: 'int', notNull: true },
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
    [
      (cb) => db.dropTable('order', cb),
      (cb) => db.dropTable('order_product', cb),
    ],
    (err, results) => {
      console.log(err, results);
      callback(err, results);
    }
  );
};

exports._meta = {
  version: 1,
};
