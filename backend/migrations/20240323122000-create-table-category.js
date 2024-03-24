'use strict';

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
  return db.createTable(
    'category',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      slug: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      createdAt: {
        type: 'string',
      },
      updatedAt: {
        type: 'string',
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  return db.dropTable('category', callback);
};

exports._meta = {
  version: 1,
};
